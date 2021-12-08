import User from "../models/user";
import { hashPassword, comparePassword } from "../utils/auth";
import jwt from "jsonwebtoken";
import queryString from "query-string";

const stripe = require("stripe")(process.env.STRIPE_SECRET);

export const makeInstructor = async (req, res) => {
  try {
    //1. Find user in the db
    const user = await User.findById(req.user._id).exec();
    console.log({ user });
    if (!user) return res.status(400).send("User does not exist");

    //2. if user doesnt have stripe_account_id yet, then create new
    if (!user.stripe_account_id) {
      const account = await stripe.accounts.create({ type: "express" });
      // console.log("account:", account);
      user.stripe_account_id = account.id;
      await user.save();
    }

    //3. create account link base on account id (for frontend to complete onboarding)
    let accountLink = await stripe.accountLinks.create({
      account: user.stripe_account_id,
      refresh_url: process.env.STRIPE_REDIRECT_URL,
      return_url: process.env.STRIPE_REDIRECT_URL,
      type: "account_onboarding",
    });

    console.log("Account Link:", accountLink);

    //4. Re-fill any info such as email (optional), then send url response to frontend
    accountLink = Object.assign(accountLink, {
      "stripe_user[email]": user.email,
    });

    //5. Send the account link as a response to frontend
    res.send(`${accountLink.url}?${queryString.stringify(accountLink)}`);
  } catch (error) {
    console.log("STRIPE ERROR:", error);
  }
};

export const getAccountStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).exec();
    const account = await stripe.accounts.retrieve(user.stripe_account_id);
    console.log("ACCOUNT STRIPE:", account);

    if (!account.charges_enabled) {
      return res.status(401).send("Unauthorized");
    }

    const statusUpdated = await User.findByIdAndUpdate(
      user._id,
      {
        stripe_seller: account,
        $addToSet: { role: "Instructor" },
      },
      { new: true }
    )
      .select("-password")
      .exec();
    res.json(statusUpdated);
  } catch (error) {
    console.log("ERROR:", error);
  }
};

export const currentInstructor = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password").exec();

    if (!user || !user.role.includes("Instructor"))
      return res.status(403).send("Unauthorized");

    res.json({ ok: true });
  } catch (error) {
    console.log("ERROR", error);
  }
};
