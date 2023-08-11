import faker from "@faker-js/faker";
import { prisma } from "@/config";

export default async function generateActivity(auditoriumId: number) {
  return prisma.activity.create({
    data: {
      name: faker.commerce.department(),
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      startTime: new Date(Date.now()),
      endTime: new Date(Date.now()),
      auditoriumId,
    }
  });
}

export async function enrollActivity(userId: number, activityId: number) {
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

export async function getEnrolledActivites(id: number) {
  return await prisma.activity.count({
    where: {
      id: id,
      Enrollment: {
        some: {}
      }
    }
  });
}
