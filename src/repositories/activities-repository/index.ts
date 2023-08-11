import { prisma } from "@/config";

async function getEnrolledActivites(id: number) {
  const enrolledCount = await prisma.enrollment.count({
    where: {
      Activity: {
        some: {
          id: id
        }
      }
    }
  });

  return enrolledCount;
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

async function getActivityById(id: number) {
  return await prisma.activity.findUnique({
    where: {
      id
    }
  });
}

async function getOnEnrolledActivity(userId: number, activityId: number) {
  return prisma.activity.findUnique({
    where: {
      id: activityId
    },
    include: {
      Enrollment: {
        where: {
          userId
        }
      }
    }
  });
}

const activitiesRepository = {
  getEnrolledActivites,
  enrollActivity,
  unenrollActivity,
  getActivityById,
  getOnEnrolledActivity
};
export default activitiesRepository;
