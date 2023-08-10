import activitiesRepository from "@/repositories/activities-repository";
import enrollmentsService from "../enrollments-service";

async function getEnrolledActivites(activityId: number) {
  return await activitiesRepository.getEnrolledActivites(activityId);
}

async function enrollActivity(userId: number, activityId: number) {
  return await activitiesRepository.enrollActivity(userId, activityId);
}

async function unenrollActivity(userId: number, activityId: number ) {
  const enrollment = await enrollmentsService.getOneWithAddressByUserId(userId);
  return await activitiesRepository.unenrollActivity(activityId, enrollment.id);
}

const activitiesService = {
  getEnrolledActivites,
  enrollActivity,
  unenrollActivity
};

export default activitiesService;
