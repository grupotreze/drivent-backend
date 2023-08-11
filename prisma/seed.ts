import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
const prisma = new PrismaClient();

(async () => {
  await prisma.address.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.ticket.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.ticketType.deleteMany({});
  await prisma.room.deleteMany({});
  await prisma.activity.deleteMany({});
  await prisma.auditorium.deleteMany({});
  await prisma.hotel.deleteMany({});
})();

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

  await prisma.ticketType.create({
    data: {
      name: "Presencial",
      price: 25000,
      isRemote: false,
      includesHotel: true,
    },
  });

  await prisma.ticketType.create({
    data: {
      name: "Presencial",
      price: 25000,
      isRemote: false,
      includesHotel: false,
    },
  });

  await prisma.ticketType.create({
    data: {
      name: "Online",
      price: 10000,
      isRemote: true,
      includesHotel: false,
    },
  });

  const autitorium1 = await prisma.auditorium.create({
    data: {
      name: "Auditório Principal",
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      Event: {
        connect: {
          id: event.id
        }
      }
    }
  });

  const autitorium2 = await prisma.auditorium.create({
    data: {
      name: "Auditório Lateral",
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      Event: {
        connect: {
          id: event.id
        }
      }
    }
  });

  const autitorium3 = await prisma.auditorium.create({
    data: {
      name: "Sala de WorkShop",
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      Event: {
        connect: {
          id: event.id
        }
      }
    }
  });

  let day = 1;

  while (day <= 3) {
    await prisma.activity.create({
      data: {
        name: "Minecraft: montando o PC ideal",
        auditoriumId: autitorium1.id,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
        startTime: dayjs().add(day, "day").startOf("day").add(9, "hour").toDate(),
        endTime: dayjs().add(day, "day").startOf("day").add(9, "hour").clone().add(1, "hour").toDate(),
        capacity: 13,
      }
    });

    await prisma.activity.create({
      data: {
        name: "LoL: montando o PC ideal",
        auditoriumId: autitorium1.id,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
        startTime: dayjs().add(day, "day").startOf("day").add(10, "hour").toDate(),
        endTime: dayjs().add(day, "day").startOf("day").add(10, "hour").clone().add(1, "hour").toDate(),
        capacity: 23,

      }
    });

    await prisma.activity.create({
      data: {
        name: "Palestra x",
        auditoriumId: autitorium2.id,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
        startTime: dayjs().add(day, "day").startOf("day").add(9, "hour").toDate(),
        endTime: dayjs().add(day, "day").startOf("day").add(9, "hour").clone().add(4, "hour").toDate(),
        capacity: 17,
      }
    });

    await prisma.activity.create({
      data: {
        name: "Palestra y",
        auditoriumId: autitorium3.id,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
        startTime: dayjs().add(day, "day").startOf("day").add(9, "hour").toDate(),
        endTime: dayjs().add(day, "day").startOf("day").add(9, "hour").clone().add(1, "hour").toDate(),
        capacity: 20,
      }
    });

    await prisma.activity.create({
      data: {
        name: "Palestra z",
        auditoriumId: autitorium3.id,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
        startTime: dayjs().add(day, "day").startOf("day").add(10, "hour").toDate(),
        endTime: dayjs().add(day, "day").startOf("day").add(10, "hour").clone().add(1, "hour").toDate(),
        capacity: 30,

      }
    });
    day++;
  }

  console.log("Creating hotels...\n");

  const hotel1 = await prisma.hotel.create({
    data: {
      image: "https://user-images.githubusercontent.com/114487600/258648219-b952e5a5-c999-401d-b8b2-967869bfa5b0.png",
      name: "Driven Resort",
    }
  });

  const hotel2 = await prisma.hotel.create({
    data: {
      image: "https://user-images.githubusercontent.com/114487600/258648236-b8b8453e-ca10-4f5e-b729-2d8fc1288e8f.png",
      name: "Driven Palace",
    }
  });

  const hotel3 = await prisma.hotel.create({
    data: {
      image: "https://user-images.githubusercontent.com/114487600/258648248-934a6e66-19dc-476e-a543-545ec4fded6f.png",
      name: "Driven World",
    }
  });

  await prisma.room.deleteMany({});
  console.log("Creating rooms...\n");

  function generateRooms(hotelId: number, floors: number) {
    const array: any = [];
    const roomsPerFloor = 10;

    for (let floor = 1; floor <= floors; floor++) {
      for (let roomNumber = 1; roomNumber <= roomsPerFloor; roomNumber++) {
        const room = {
          capacity: floor,
          name: `${floor}${roomNumber < 10 ? "0" : ""}${roomNumber}`,
          hotelId,
        };
        array.push(room);
      }
    }

    return array;
  }

  const roomsHotel1 = generateRooms(hotel1.id, 2);
  await prisma.room.createMany({ data: roomsHotel1 });
  const roomshotel2 = generateRooms(hotel2.id, 3);
  await prisma.room.createMany({ data: roomshotel2 });
  const roomsHotel3 = generateRooms(hotel3.id, 2);
  await prisma.room.createMany({ data: roomsHotel3 });

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
