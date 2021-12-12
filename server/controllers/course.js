import AWS from "aws-sdk";
import { nanoid } from "nanoid";
import slugify from "slugify";

import Course from "../models/course";

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  apiVersion: process.env.AWS_API_VERSION,
};

const S3 = new AWS.S3(awsConfig);

export const uploadImage = async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).send("No image");

    // prepare the image
    const base64Data = new Buffer.from(
      image.replace(/^data:image\/w+;base64,/, ""),
      "base64"
    );

    const type = image.split(";")[0].split("/")[1];

    // image params
    const params = {
      Bucket: "stress-bucket",
      Key: `${nanoid()}.${type}`,
      Body: base64Data,
      ACL: "public-read",
      ContentEnCoding: "base64",
      ContentType: `image/${type}`,
    };

    //upload to s3
    S3.upload(params, (err, data) => {
      if (err) {
        console.log("ERRRRRRRR:", err);
        return res.sendStatus(400);
      }

      console.log(data);
      res.send(data);
    });
  } catch (error) {
    console.log("ERRORR:", error);
  }
};

export const removeImage = async (req, res) => {
  try {
    const { image } = req.body;
    // iamge params
    const params = {
      Bucket: image.Bucket,
      Key: image.Key,
    };
    // send remove request to S3
    S3.deleteObject(params, (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(400);
      }
      res.send({ ok: true });
    });
  } catch (error) {
    console.log(error);
  }
};

export const create = async (req, res) => {
  console.log("INFOR:", req.body);

  try {
    const courseExist = await Course.findOne({
      slug: slugify(req.body.name.toLowerCase()),
    }).exec();

    if (courseExist) return res.status(400).send("Course have existed");

    const course = new Course({
      ...req.body,
      slug: slugify(req.body.name),
      instructor: req.user._id,
    });
    await course.save();

    res.json(course);
  } catch (error) {
    console.log(error);
  }
};

export const read = async (req, res) => {
  try {
    const { slug } = req.params;
    const course = await Course.findOne({ slug })
      .populate("instructor", "_id name")
      .exec();
    if (!course) return res.status(400).send("No course");
    res.json(course);
  } catch (error) {
    console.log(error);
  }
};
