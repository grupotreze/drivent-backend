import activitiesRepository from "@/repositories/activities-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import activitiesService from "@/services/activities-service";
import faker from "@faker-js/faker";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("GET /activities/:activityId", () => {
  it("Should return notFountError if has no activity", () => {
    const activityMock = jest.spyOn(activitiesRepository, "getActivityById");
    const activityId = faker.datatype.number();
    const userId = faker.datatype.number();
    activityMock.mockResolvedValueOnce(null);

    const promise = activitiesService.getEnrolledActivites(userId, activityId);

    expect(activityMock).toBeCalledTimes(1);
    expect(promise).rejects.toEqual({
      name: "NotFoundError",
      message: "This activity does not exists!",
    });
  });

  it("Should return ConflictError if user has no enrollment", () => {
    const enrollmentMock = jest.spyOn(enrollmentRepository, "findWithAddressByUserId");
    const activityMock = jest.spyOn(activitiesRepository, "getActivityById");
    const activityId = faker.datatype.number();
    const userId = faker.datatype.number();

    activityMock.mockImplementationOnce((): any => {
      return { id: activityId };
    });

    enrollmentMock.mockResolvedValueOnce(null);

    const promise = activitiesService.getEnrolledActivites(userId, activityId);

    expect(activityMock).toBeCalledTimes(1);
    expect(promise).rejects.toEqual({
      name: "ConflictError",
      message: "You need to complete your enrollment before select an activity!",
    });
  });

  it("Should return ConflictError if user has no ticket", () => {
    const enrollmentMock = jest.spyOn(enrollmentRepository, "findWithAddressByUserId");
    const enrollmentId = faker.datatype.number();

    const activityMock = jest.spyOn(activitiesRepository, "getActivityById");
    const activityId = faker.datatype.number();
    const userId = faker.datatype.number();

    const ticketMock = jest.spyOn(ticketRepository, "findTicketByEnrollmentId");
    activityMock.mockImplementationOnce((): any => {
      return { id: activityId };
    });

    enrollmentMock.mockImplementationOnce((): any => {
      return { id: enrollmentId };
    });

    ticketMock.mockResolvedValueOnce(null);

    const promise = activitiesService.getEnrolledActivites(userId, activityId);

    expect(activityMock).toBeCalledTimes(1);
    expect(promise).rejects.toEqual({
      name: "ConflictError",
      message: "You need to complete your enrollment before select an activity!",
    });
  });

  it("Should return ConflictError if user ticket is remote", () => {
    const enrollmentMock = jest.spyOn(enrollmentRepository, "findWithAddressByUserId");
    const enrollmentId = faker.datatype.number();

    const activityMock = jest.spyOn(activitiesRepository, "getActivityById");
    const activityId = faker.datatype.number();
    const userId = faker.datatype.number();

    const ticketMock = jest.spyOn(ticketRepository, "findTicketByEnrollmentId");
    activityMock.mockImplementationOnce((): any => {
      return { id: activityId };
    });

    enrollmentMock.mockImplementationOnce((): any => {
      return { id: enrollmentId };
    });

    ticketMock.mockImplementationOnce((): any => {
      return { TicketType: { isRemote: true } };
    });

    const promise = activitiesService.getEnrolledActivites(userId, activityId);

    expect(activityMock).toBeCalledTimes(1);
    expect(promise).rejects.toEqual({
      name: "ConflictError",
      message: "Your ticket dont need activities enrollments!",
    });
  });

  it("Should return ConflictError if user ticket is not paid", () => {
    const enrollmentMock = jest.spyOn(enrollmentRepository, "findWithAddressByUserId");
    const enrollmentId = faker.datatype.number();

    const activityMock = jest.spyOn(activitiesRepository, "getActivityById");
    const activityId = faker.datatype.number();
    const userId = faker.datatype.number();

    const ticketMock = jest.spyOn(ticketRepository, "findTicketByEnrollmentId");
    activityMock.mockImplementationOnce((): any => {
      return { id: activityId };
    });

    enrollmentMock.mockImplementationOnce((): any => {
      return { id: enrollmentId };
    });

    ticketMock.mockImplementationOnce((): any => {
      return { TicketType: { isRemote: false }, status: "RESERVED" };
    });

    const promise = activitiesService.getEnrolledActivites(userId, activityId);

    expect(activityMock).toBeCalledTimes(1);
    expect(promise).rejects.toEqual({
      name: "ConflictError",
      message: "You need to complete your enrollment payment before select an activity!",
    });
  });
});

describe("POST /activities/:activityId", () => {
  it("Should return notFountError if has no activity", () => {
    const activityMock = jest.spyOn(activitiesRepository, "getActivityById");
    const activityId = faker.datatype.number();
    const userId = faker.datatype.number();
    activityMock.mockResolvedValueOnce(null);

    const promise = activitiesService.enrollActivity(userId, activityId);

    expect(activityMock).toBeCalledTimes(1);
    expect(promise).rejects.toEqual({
      name: "NotFoundError",
      message: "This activity does not exists!",
    });
  });

  it("Should return ConflictError if user has no enrollment", () => {
    const enrollmentMock = jest.spyOn(enrollmentRepository, "findWithAddressByUserId");
    const activityMock = jest.spyOn(activitiesRepository, "getActivityById");
    const activityId = faker.datatype.number();
    const userId = faker.datatype.number();

    activityMock.mockImplementationOnce((): any => {
      return { id: activityId };
    });

    enrollmentMock.mockResolvedValueOnce(null);

    const promise = activitiesService.enrollActivity(userId, activityId);

    expect(activityMock).toBeCalledTimes(1);
    expect(promise).rejects.toEqual({
      name: "ConflictError",
      message: "You need to complete your enrollment before select an activity!",
    });
  });

  it("Should return ConflictError if user has no ticket", () => {
    const enrollmentMock = jest.spyOn(enrollmentRepository, "findWithAddressByUserId");
    const enrollmentId = faker.datatype.number();

    const activityMock = jest.spyOn(activitiesRepository, "getActivityById");
    const activityId = faker.datatype.number();
    const userId = faker.datatype.number();
    const ticketMock = jest.spyOn(ticketRepository, "findTicketByEnrollmentId");
    activityMock.mockImplementationOnce((): any => {
      return { id: activityId };
    });

    enrollmentMock.mockImplementationOnce((): any => {
      return { id: enrollmentId };
    });

    ticketMock.mockResolvedValueOnce(null);

    const promise = activitiesService.enrollActivity(userId, activityId);

    expect(activityMock).toBeCalledTimes(1);
    expect(promise).rejects.toEqual({
      name: "ConflictError",
      message: "You need to complete your enrollment before select an activity!",
    });
  });

  it("Should return ConflictError if user ticket is remote", () => {
    const enrollmentMock = jest.spyOn(enrollmentRepository, "findWithAddressByUserId");
    const enrollmentId = faker.datatype.number();

    const activityMock = jest.spyOn(activitiesRepository, "getActivityById");
    const activityId = faker.datatype.number();
    const userId = faker.datatype.number();
    const ticketMock = jest.spyOn(ticketRepository, "findTicketByEnrollmentId");
    activityMock.mockImplementationOnce((): any => {
      return { id: activityId };
    });

    enrollmentMock.mockImplementationOnce((): any => {
      return { id: enrollmentId };
    });

    ticketMock.mockImplementationOnce((): any => {
      return { TicketType: { isRemote: true } };
    });

    const promise = activitiesService.enrollActivity(userId, activityId);

    expect(activityMock).toBeCalledTimes(1);
    expect(promise).rejects.toEqual({
      name: "ConflictError",
      message: "Your ticket dont need activities enrollments!",
    });
  });

  it("Should return ConflictError if user ticket is not paid", () => {
    const enrollmentMock = jest.spyOn(enrollmentRepository, "findWithAddressByUserId");
    const enrollmentId = faker.datatype.number();

    const activityMock = jest.spyOn(activitiesRepository, "getActivityById");
    const activityId = faker.datatype.number();
    const userId = faker.datatype.number();

    const ticketMock = jest.spyOn(ticketRepository, "findTicketByEnrollmentId");
    activityMock.mockImplementationOnce((): any => {
      return { id: activityId };
    });

    enrollmentMock.mockImplementationOnce((): any => {
      return { id: enrollmentId };
    });

    ticketMock.mockImplementationOnce((): any => {
      return { TicketType: { isRemote: false }, status: "RESERVED" };
    });

    const promise = activitiesService.enrollActivity(userId, activityId);

    expect(activityMock).toBeCalledTimes(1);
    expect(promise).rejects.toEqual({
      name: "ConflictError",
      message: "You need to complete your enrollment payment before select an activity!",
    });
  });
});

describe("DELETE /activities/:activityId", () => {
  it("Should return notFountError if has no activity", () => {
    const activityMock = jest.spyOn(activitiesRepository, "getActivityById");
    const activityId = faker.datatype.number();
    const userId = faker.datatype.number();
    activityMock.mockResolvedValueOnce(null);

    const promise = activitiesService.unenrollActivity(userId, activityId);

    expect(activityMock).toBeCalledTimes(1);
    expect(promise).rejects.toEqual({
      name: "NotFoundError",
      message: "This activity does not exists!",
    });
  });

  it("Should return ConflictError if user has no enrollment", () => {
    const enrollmentMock = jest.spyOn(enrollmentRepository, "findWithAddressByUserId");
    const activityMock = jest.spyOn(activitiesRepository, "getActivityById");
    const activityId = faker.datatype.number();
    const userId = faker.datatype.number();

    activityMock.mockImplementationOnce((): any => {
      return { id: activityId };
    });

    enrollmentMock.mockResolvedValueOnce(null);

    const promise = activitiesService.unenrollActivity(userId, activityId);

    expect(activityMock).toBeCalledTimes(1);
    expect(promise).rejects.toEqual({
      name: "ConflictError",
      message: "You need to complete your enrollment before unenroll an activity!",
    });
  });

  it("Should return ConflictError if user has no ticket", () => {
    const enrollmentMock = jest.spyOn(enrollmentRepository, "findWithAddressByUserId");
    const enrollmentId = faker.datatype.number();

    const activityMock = jest.spyOn(activitiesRepository, "getActivityById");
    const activityId = faker.datatype.number();
    const userId = faker.datatype.number();
    const ticketMock = jest.spyOn(ticketRepository, "findTicketByEnrollmentId");
    activityMock.mockImplementationOnce((): any => {
      return { id: activityId };
    });

    enrollmentMock.mockImplementationOnce((): any => {
      return { id: enrollmentId };
    });

    ticketMock.mockResolvedValueOnce(null);

    const promise = activitiesService.unenrollActivity(userId, activityId);

    expect(activityMock).toBeCalledTimes(1);
    expect(promise).rejects.toEqual({
      name: "ConflictError",
      message: "You need to complete your enrollment before unenroll an activity!",
    });
  });

  it("Should return ConflictError if user ticket is remote", () => {
    const enrollmentMock = jest.spyOn(enrollmentRepository, "findWithAddressByUserId");
    const enrollmentId = faker.datatype.number();

    const activityMock = jest.spyOn(activitiesRepository, "getActivityById");
    const activityId = faker.datatype.number();
    const userId = faker.datatype.number();
    const ticketMock = jest.spyOn(ticketRepository, "findTicketByEnrollmentId");
    activityMock.mockImplementationOnce((): any => {
      return { id: activityId };
    });

    enrollmentMock.mockImplementationOnce((): any => {
      return { id: enrollmentId };
    });

    ticketMock.mockImplementationOnce((): any => {
      return { TicketType: { isRemote: true } };
    });

    const promise = activitiesService.unenrollActivity(userId, activityId);

    expect(activityMock).toBeCalledTimes(1);
    expect(promise).rejects.toEqual({
      name: "ConflictError",
      message: "Your ticket dont need activities enrollments!",
    });
  });

  it("Should return ConflictError if user ticket is not paid", async () => {
    const enrollmentMock = jest.spyOn(enrollmentRepository, "findWithAddressByUserId");
    const enrollmentId = faker.datatype.number();

    const activityMock = jest.spyOn(activitiesRepository, "getActivityById");
    const activityId = faker.datatype.number();
    const userId = faker.datatype.number();

    const ticketMock = jest.spyOn(ticketRepository, "findTicketByEnrollmentId");
    activityMock.mockImplementationOnce((): any => {
      return { id: activityId };
    });

    enrollmentMock.mockImplementationOnce((): any => {
      return { id: enrollmentId };
    });

    ticketMock.mockImplementationOnce((): any => {
      return { TicketType: { isRemote: false }, status: "RESERVED" };
    });

    const promise = activitiesService.unenrollActivity(userId, activityId);

    await expect(promise).rejects.toEqual({
      name: "ConflictError",
      message: "You need to complete your enrollment payment before unenroll an activity!",
    });

    expect(enrollmentMock).toBeCalledTimes(1);
    expect(activityMock).toBeCalledTimes(1);
    expect(ticketMock).toBeCalledTimes(1);
  });

  it("Should return NotFoundError if user ticket is not enrolled in any activity", async () => {
    const enrollmentMock = jest.spyOn(enrollmentRepository, "findWithAddressByUserId");
    const enrollmentId = faker.datatype.number();

    const getActivityMock = jest.spyOn(activitiesRepository, "getActivityById");
    const enrolledActivityMock = jest.spyOn(activitiesRepository, "getOnEnrolledActivity");
    const activityId = faker.datatype.number();
    const userId = faker.datatype.number();

    const ticketMock = jest.spyOn(ticketRepository, "findTicketByEnrollmentId");
    getActivityMock.mockImplementationOnce((): any => {
      return { id: activityId };
    });

    enrollmentMock.mockImplementationOnce((): any => {
      return { id: enrollmentId };
    });

    ticketMock.mockImplementationOnce((): any => {
      return { TicketType: { isRemote: false }, status: "PAID" };
    });

    enrolledActivityMock.mockResolvedValueOnce(null);

    const promise = activitiesService.unenrollActivity(userId, activityId);

    await expect(promise).rejects.toEqual({
      name: "NotFoundError",
      message: "You are not enrolled in this activity!",
    });
    expect(ticketMock).toBeCalledTimes(1);
    expect(enrollmentMock).toBeCalledTimes(1);
    expect(getActivityMock).toBeCalledTimes(1);
    expect(enrolledActivityMock).toBeCalledTimes(1);
  });
});
