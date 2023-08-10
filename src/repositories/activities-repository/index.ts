import { prisma } from "@/config";

async function getEnrolledActivites(id: number) {
  return await prisma.activity.count({
    where: {
      id: id,
      Enrollment: {
        some: {}
      }
    }
  });
}
async function enrollActivity(userId: number, activityId: number) {
  return await prisma.enrollment.update({
    data: {
      Activity: {
        connect: {
          id: activityId
        }
      }
    },
    where: {
      userId
    }
  });
}

async function unenrollActivity(activityId: number, enrollmentId: number ) {
  return await prisma.$queryRaw`
    DELETE FROM "_ActivityToEnrollment" WHERE "A" = ${activityId} AND "B" = ${enrollmentId}
  `;
}
const activitiesRepository = {
  getEnrolledActivites,
  enrollActivity,
  unenrollActivity
};
export default activitiesRepository;
