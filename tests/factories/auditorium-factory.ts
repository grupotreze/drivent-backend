import faker from "@faker-js/faker";
import { prisma } from "@/config";

export default async function generateAuditoriums(eventId: number) {
  return prisma.auditorium.create({
    data: {
      name: faker.commerce.department(),
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      Event: {
        connect: {
          id: eventId
        }
      }
    }
  });
}

