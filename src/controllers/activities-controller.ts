import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";
import activitiesService from "@/services/activities-service";

export async function getEnrolledActivites(req: AuthenticatedRequest, res: Response) {
  const activityId = Number(req.params.activityId);
  const { userId } = req;
  try {
    const enrollments = await activitiesService.getEnrolledActivites(userId, activityId);
    res.status(httpStatus.OK).send({ enrollments });
  } catch (error) {
    if(error.name === "NotFoundError") {
      res.status(httpStatus.NOT_FOUND).send({ name: error.name, message: error.message });
    }
  }
}
export async function enrollActivity(req: AuthenticatedRequest, res: Response) {
  const activityId = Number(req.params.activityId);
  const { userId } = req;

  await activitiesService.enrollActivity(userId, activityId);
  res.sendStatus(httpStatus.OK);
}

export async function unenrollActivity(req: AuthenticatedRequest, res: Response) {
  const activityId = Number(req.params.activityId);
  const { userId } = req;

  await activitiesService.unenrollActivity(userId, activityId);
  res.sendStatus(httpStatus.NO_CONTENT);
}

