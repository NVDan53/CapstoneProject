import express from "express";
import { uploadImage, removeImage, create, read } from "../controllers/course";

const router = express.Router();

// middleware
import { isInstructor, requireSignin } from "../middlewares";

router.post("/course/upload-image", uploadImage);
router.post("/course/remove-image", removeImage);

// course
router.post("/course", requireSignin, isInstructor, create);
router.get("/course/:slug", read);

module.exports = router;
