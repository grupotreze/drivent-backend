import { faker } from '@faker-js/faker';
import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
const prisma = new PrismaClient();

async function main() {
  let event = await prisma.event.findFirst();
  if (!event) {
    event = await prisma.event.create({
      data: {
        title: "Driven.t",
        logoImageUrl: "https://files.driveneducation.com.br/images/logo-rounded.png",
        backgroundImageUrl: "linear-gradient(to right, #FA4098, #FFD77F)",
        startsAt: dayjs().toDate(),
        endsAt: dayjs().add(21, "days").toDate(),
      },
    });
  }
  await prisma.ticketType.deleteMany({})

    await prisma.ticketType.create({
      data: {
        name: "Presencial",
        price: faker.datatype.number(),
        isRemote: false,
        includesHotel: true,
      },
    });
  
    await prisma.ticketType.create({
      data: {
        name: "Online",
        price: faker.datatype.number(),
        isRemote: true,
        includesHotel: false,
      },
    });
    
  console.log({ event });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
