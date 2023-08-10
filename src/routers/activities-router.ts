import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { enrollActivity, getEnrolledActivites, unenrollActivity,  } from "@/controllers/activities-controller";

const activitiesRouter = Router();

activitiesRouter
  .use(authenticateToken)
  .get("/:activityId", getEnrolledActivites)
  .post("/:activityId", enrollActivity)
  .delete("/:activityId", unenrollActivity);

export { activitiesRouter };
