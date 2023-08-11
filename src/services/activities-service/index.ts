import activitiesRepository from "@/repositories/activities-repository";
import { conflictError, notFoundError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import paymentRepository from "@/repositories/payment-repository";

async function getEnrolledActivites(userId: number, activityId: number) {
  const activity = await activitiesRepository.getActivityById(activityId);
  if(!activity) throw notFoundError("This activity does not exists!");

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if(!enrollment) throw conflictError("You need to complete your enrollment before select an activity!");

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if(!ticket) throw conflictError("You need to complete your enrollment before select an activity!");
  if(ticket.TicketType.isRemote) throw conflictError("Your ticket dont need activities enrollments!");
  if(ticket.status === "RESERVED") throw conflictError("You need to complete your enrollment payment before select an activity!");

  const enrolls = await activitiesRepository.getEnrolledActivites(activityId);

  return enrolls;
}

async function enrollActivity(userId: number, activityId: number) {
  const activity = await activitiesRepository.getActivityById(activityId);
  if(!activity) throw notFoundError("This activity does not exists!");

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if(!enrollment) throw conflictError("You need to complete your enrollment before select an activity!");

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if(!ticket) throw conflictError("You need to complete your enrollment before select an activity!");
  if(ticket.TicketType.isRemote) throw conflictError("Your ticket dont need activities enrollments!");
  if(ticket.status === "RESERVED")  throw conflictError("You need to complete your enrollment payment before select an activity!");

  return await activitiesRepository.enrollActivity(userId, activityId);
}

async function unenrollActivity(userId: number, activityId: number ) {
  const activity = await activitiesRepository.getActivityById(activityId);
  if(!activity) throw notFoundError("This activity does not exists!");

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if(!enrollment) throw conflictError("You need to complete your enrollment before unenroll an activity!");

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if(!ticket) throw conflictError("You need to complete your enrollment before unenroll an activity!");
  if(ticket.TicketType.isRemote) throw conflictError("Your ticket dont need activities enrollments!");
  if(ticket.status === "RESERVED") throw conflictError("You need to complete your enrollment payment before unenroll an activity!");

  const enrolledActivity = await activitiesRepository.getOnEnrolledActivity(userId, activityId);

  if(!enrolledActivity) throw notFoundError("You are not enrolled in this activity!");

  return await activitiesRepository.unenrollActivity(activityId, enrollment.id);
}

const activitiesService = {
  getEnrolledActivites,
  enrollActivity,
  unenrollActivity
};

export default activitiesService;
