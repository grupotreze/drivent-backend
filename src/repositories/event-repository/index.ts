import { prisma } from "@/config";

async function findFirst() {
  return prisma.event.findFirst({
    include: {
      Auditorium: {
        include: {
          Activity: {
            include: {
              Auditorium: {
                select: {
                  name: true
                }
              },
            }
          },

        },
      }
    }
  });
}

const eventRepository = {
  findFirst,
};

export default eventRepository;
