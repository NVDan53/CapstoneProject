import User from "../models/user";
import { hashPassword, comparePassword } from "../utils/auth";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";

const { google } = require("googleapis");
const { OAuth2 } = google.auth;

const client = new OAuth2(process.env.MAILING_SERVICE_CLIENT_ID);

import AWS from "aws-sdk";
import sendMail from "./sendMail";

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  apiVersion: process.env.AWS_API_VERSION,
};

const SES = new AWS.SES(awsConfig);

// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // validate
    if (!name) return res.status(400).send("Name is required");
    if (!password || password.length < 6) {
      return res
        .status(400)
        .send("Password is required and should be min 6 characters long");
    }
    let userExit = await User.findOne({ email }).exec();
    if (userExit) return res.status(400).send("Email is taken");

    // hash password
    const hashedPassword = await hashPassword(password);

    // register
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();
    // console.log("Save user:", user);
    return res.json({ ok: true });
  } catch (error) {
    console.log("ERROR: ", error);
    return res.status(400).send("Error. Try again.");
  }
};

/* LOGIN
sever
-to login: need to check if user's password is correct
-we need to take user's password, hash it then compare with the hashed password saved
-then we need to generate json web token/ JWT send to client
-this will be used to access protected routes
*/
export const login = async (req, res) => {
  try {
    // req.body
    const { email, password } = req.body;
    console.log(req.body);
    // check if our db has email
    const user = await User.findOne({ email }).exec();
    if (!user) return res.status(400).send("No user found");
    // check password
    const match = await comparePassword(password, user.password);
    if (!match) return res.status(400).send("Wrong password");
    //create signed jwt
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    // return user and token to client, exclude hashed password
    user.password = undefined;
    // send token to cookie
    res.cookie("token", token, {
      // httpOnly: true,
      // secure: true, // only works on https
    });
    res.json(user);
  } catch (error) {
    console.log("ERROR: ", error);
    return res.status(400).send("Error. Try again.");
  }
};

// Logout
export const logout = (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({ message: "Logout success" });
  } catch (error) {
    return res.status(400).send("Error. Try again.");
  }
};

// Verify current user
export const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password").exec();
    console.log("CURRENT USER: ", user);
    return res.json({ ok: true });
  } catch (error) {
    return res.status(400).send("Error. Try again.");
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { tokenId } = req.body;

    const verify = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.MAILING_SERVICE_CLIENT_ID,
    });

    console.log(verify);

    const { email_verified, email, name, picture } = verify.payload;

    // const password = email + process.env.GOOGLE_SECRET;

    // const passwordHash = await hashPassword(password);

    if (!email_verified)
      return res.status(400).json({ msg: "Email verification failed." });

    const user = await User.findOne({ email });

    if (user) {
      // const isMatch = await comparePassword(password, user.password);
      // if (!isMatch)
      //   return res.status(400).json({ msg: "Password is incorrect." });

      //create signed jwt
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      // return user and token to client, exclude hashed password
      user.password = undefined;
      // send token to cookie
      res.cookie("token", token, {
        // httpOnly: true,
        // secure: true, // only works on https
      });
      res.json(user);
    } else {
      const newUser = new User({
        name,
        email,
        password: passwordHash,
        picture,
      });

      await newUser.save();

      //create signed jwt
      const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      // return user and token to client, exclude hashed password
      user.password = undefined;
      // send token to cookie
      res.cookie("token", token, {
        // httpOnly: true,
        // secure: true, // only works on https
      });
      res.json(user);
    }
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export const sendTestEmail = async (req, res) => {
  const params = {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: ["nguyenvandan0503@gmail.com"],
    },
    ReplyToAddresses: [process.env.EMAIL_FROM],
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
          <html>
            <h1>Reset password link </h1>
            <p>Please following link to reset your password</p>
          </html>
          `,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Password reset link",
      },
    },
  };

  const emailSent = SES.sendEmail(params).promise();
  emailSent
    .then((data) => {
      console.log(data);
      res.json({ ok: true });
    })
    .catch((error) => console.log(error));
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    // const shortCode = nanoid(6).toLowerCase();
    // const user = await User.findOneAndUpdate(
    //   { email },
    //   {
    //     passwordResetCode: shortCode,
    //   }
    // );

    const user = await User.findOne({ email });

    if (!user) return res.status(400).send("User is not exist");

    // prepare for email
    // Googleapis
    // const access_token = createAccessToken({ id: user._id });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    // return user and token to client, exclude hashed password
    user.password = undefined;
    // send token to cookie
    res.cookie("token", token, {
      // httpOnly: true,
      // secure: true, // only works on https
    });
    const url = `${process.env.CLIENT_URL}/user/reset/${token}`;
    sendMail(email, url, "Reset your password");
    res.json({ msg: "Re-send the password, please check your email." });

    // AWS
    // const params = {
    //   Source: process.env.EMAIL_FROM,
    //   Destination: {
    //     ToAddresses: [email],
    //   },
    //   Message: {
    //     Body: {
    //       Html: {
    //         Charset: "UTF-8",
    //         Data: `
    //         <html>
    //           <h1>Reset password</h1>
    //           <p>Use this code to reset password</p>
    //           <h2 style="color: red;">${shortCode}</h2>
    //         </html>
    //         `,
    //       },
    //     },
    //     Subject: {
    //       Charset: "UTF-8",
    //       Data: "Reset password",
    //     },
    //   },
    // };

    // const emailSent = SES.sendEmail(params).promise();
    // emailSent.then((data) => {
    //   console.log(data);
    //   res.json({ ok: true });
    // });
  } catch (error) {
    console.log(error);
  }
};

export const resetPassword = async (req, res) => {
  // try {
  //   const { email, code, newPassword } = req.body;
  //   const hashedPassword = await hashPassword(newPassword);

  //   const user = await User.findOneAndUpdate(
  //     { email, passwordResetCode: code },
  //     {
  //       password: hashedPassword,
  //       passwordResetCode: "",
  //     }
  //   ).exec();

  //   if (!user) return res.status(400).send("User does not exist");
  //   res.json({ ok: true });
  // } catch (error) {
  //   console.log(error);
  // }

  try {
    const { password } = req.body;

    const passwordHash = await hashPassword(password);

    await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        password: passwordHash,
      }
    );

    res.json({ msg: "Password successfully changed" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

function createAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}
