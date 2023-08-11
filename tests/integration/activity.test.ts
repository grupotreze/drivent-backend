import app, { init } from "@/app";
import { prisma } from "@/config";
import faker from "@faker-js/faker";
import { TicketStatus } from "@prisma/client";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import {
  createEnrollmentWithAddress,
  createUser,
  createTicketType,
  createTicket,
  createPayment,
  generateCreditCardData,
  createTicketTypeWithHotel,
  createEvent,
} from "../factories";
import { cleanDb, generateValidToken } from "../helpers";
import generateAuditoriums from "../factories/auditorium-factory";
import generateActivity, { enrollActivity, getEnrolledActivites } from "../factories/activity-factory";

beforeAll(async () => {
  await init();
  await cleanDb();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /activities/:activityId", () => {
  describe("when token is invalid", () => {
    it("should respond with status 401 if no token is given", async () => {
      const response = await server.get("/activities");

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if given token is not valid", async () => {
      const token = faker.lorem.word();

      const response = await server.get("/activities").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if there is no session for given token", async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

      const response = await server.get("/activities").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  } );

  describe("when token is valid", () => {
    it("should response with 0 enrollments when have no enrollments for this activity", async () => {
      const event = await createEvent();
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, "PAID" );
      const auditorium = await generateAuditoriums(event.id);
      const activity = await generateActivity(auditorium.id);

      const response = await server.get(`/activities/${activity.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.statusCode).toBe(httpStatus.OK);
      expect(response.body.enrollments).toBe(0);
    });

    it("should response with one enroll", async () => {
      const event = await createEvent();
      const user1 = await createUser();
      const token1 = await generateValidToken(user1);
      const enrollment1 = await createEnrollmentWithAddress(user1);

      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment1.id, ticketType.id, "PAID" );

      const auditorium = await generateAuditoriums(event.id);
      const activity = await generateActivity(auditorium.id);
      await enrollActivity(user1.id, activity.id);

      const response = await server.get(`/activities/${activity.id}`).set("Authorization", `Bearer ${token1}`);

      expect(response.statusCode).toBe(httpStatus.OK);
      expect(response.body.enrollments).toBe(1);
    });

    it("should response with many numbers of enrollments", async () => {
      const event = await createEvent();
      const user1 = await createUser();
      const token1 = await generateValidToken(user1);
      const enrollment1 = await createEnrollmentWithAddress(user1);
      const user2 = await createUser();
      const enrollment2 = await createEnrollmentWithAddress(user2);
      const user3 = await createUser();
      const enrollment3 = await createEnrollmentWithAddress(user3);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment1.id, ticketType.id, "PAID" );
      await createTicket(enrollment2.id, ticketType.id, "PAID" );
      await createTicket(enrollment3.id, ticketType.id, "PAID" );
      const auditorium = await generateAuditoriums(event.id);
      const activity = await generateActivity(auditorium.id);
      await enrollActivity(user1.id, activity.id);
      await enrollActivity(user2.id, activity.id);
      await enrollActivity(user3.id, activity.id);

      const response = await server.get(`/activities/${activity.id}`).set("Authorization", `Bearer ${token1}`);

      expect(response.statusCode).toBe(httpStatus.OK);
      expect(response.body.enrollments).toBe(3);
    });
  });
});

describe("POST /activities/:activityId", () => {
  describe("when token is invalid", () => {
    it("should respond with status 401 if no token is given", async () => {
      const response = await server.get("/activities");

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if given token is not valid", async () => {
      const token = faker.lorem.word();

      const response = await server.get("/activities").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if there is no session for given token", async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

      const response = await server.get("/activities").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  } );

  describe("when token is valid", () => {
    it("should enroll the user in activity and respond with status 200", async () => {
      const event = await createEvent();
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, "PAID" );
      const auditorium = await generateAuditoriums(event.id);
      const activity = await generateActivity(auditorium.id);

      const { statusCode } = await server.post(`/activities/${activity.id}`).set("Authorization", `Bearer ${token}`);

      expect(statusCode).toBe(httpStatus.OK);
    });
  });
});

describe("DELETE /activities/:activityId", () => {
  describe("when token is invalid", () => {
    it("should respond with status 401 if no token is given", async () => {
      const response = await server.get("/activities");

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if given token is not valid", async () => {
      const token = faker.lorem.word();

      const response = await server.get("/activities").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if there is no session for given token", async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

      const response = await server.get("/activities").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  } );

  describe("when token is valid", () => {
    it("should unenroll the user in activity and respond with status 204", async () => {
      const event = await createEvent();
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      await createTicket(enrollment.id, ticketType.id, "PAID" );
      const auditorium = await generateAuditoriums(event.id);
      const activity = await generateActivity(auditorium.id);
      await enrollActivity(user.id, activity.id);

      const response= await server.delete(`/activities/${activity.id}`).set("Authorization", `Bearer ${token}`);
      expect(response.statusCode).toBe(httpStatus.NO_CONTENT);
    });
  });
});
