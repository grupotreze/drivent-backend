import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";
import activitiesService from "@/services/activities-service";
export async function getEnrolledActivites(req: AuthenticatedRequest, res: Response) {
  const activityId = Number(req.params.activityId);

  try {
    const enrollments = await activitiesService.getEnrolledActivites(activityId);
    res.send({ enrollments });
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function enrollActivity(req: AuthenticatedRequest, res: Response) {
  const activityId = Number(req.params.activityId);
  const { userId } = req;
  try {
    await activitiesService.enrollActivity(userId, activityId);
    res.sendStatus(httpStatus.OK);
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function unenrollActivity(req: AuthenticatedRequest, res: Response) {
  const activityId = Number(req.params.activityId) || null;
  const { userId } = req;
  try {
    await activitiesService.unenrollActivity(userId, activityId);
    res.sendStatus(httpStatus.OK);
  } catch (error) {
    if (error.name === "UnauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

