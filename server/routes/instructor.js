import express from "express";
import {
  makeInstructor,
  getAccountStatus,
  currentInstructor,
  instructorCourses,
} from "../controllers/instructor";

const router = express.Router();

// middleware
import { requireSignin } from "../middlewares";

//route
router.post("/make-instructor", requireSignin, makeInstructor);
router.post("/get-account-status", requireSignin, getAccountStatus);
router.post("/current-instructor", requireSignin, currentInstructor);

router.get("/instructor-courses", requireSignin, instructorCourses);

module.exports = router;
