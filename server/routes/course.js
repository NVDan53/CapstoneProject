import express from "express";
import formidable from "express-formidable";
import {
  uploadImage,
  removeImage,
  create,
  read,
  uploadVideo,
  removeVideo,
} from "../controllers/course";

const router = express.Router();

// middleware
import { isInstructor, requireSignin } from "../middlewares";

router.post("/course/upload-image", uploadImage);
router.post("/course/remove-image", removeImage);

// course
router.post("/course", requireSignin, isInstructor, create);
router.get("/course/:slug", read);
router.post("/course/video-upload", requireSignin, formidable(), uploadVideo);
router.post("/course/video-remove", requireSignin, removeVideo);

module.exports = router;
