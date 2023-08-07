/* eslint-disable boundaries/element-types */
import hotelRepository from "@/repositories/hotel-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { notFoundError } from "@/errors";
import { cannotListHotelsError } from "@/errors/cannot-list-hotels-error";
import redis, { DEFAULT_EXP } from "@/config/redis";

async function listHotels(userId: number) {
  //Tem enrollment?
  const cacheKey = `listHotels:${userId}`;
  const cachedEnrollment = await redis.get(cacheKey);

  if (cachedEnrollment) return JSON.parse(cachedEnrollment);

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  //Tem ticket pago isOnline false e includesHotel true
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw cannotListHotelsError();
  }

  redis.setEx(cacheKey, DEFAULT_EXP, JSON.stringify(ticket));
}

async function getHotels(userId: number) {
  await listHotels(userId);
  const cacheKey = `getHotels${userId}`;
  const cachedHotels = await redis.get(cacheKey);

  if (cachedHotels) return JSON.parse(cachedHotels);

  const hotels = await hotelRepository.findHotels();

  redis.setEx(cacheKey, DEFAULT_EXP, JSON.stringify(hotels));
  return hotels;
}

async function getHotelsWithRooms(userId: number, hotelId: number) {
  await listHotels(userId);

  const cacheKey = `getHotelsWithRooms${userId}`;
  const cachedHotels = await redis.get(cacheKey);

  if (cachedHotels) return JSON.parse(cachedHotels);

  const hotel = await hotelRepository.findRoomsByHotelId(hotelId);

  if (!hotel) {
    throw notFoundError();
  }

  redis.setEx(cacheKey, DEFAULT_EXP, JSON.stringify(hotel));
  return hotel;
}

const hotelService = {
  getHotels,
  getHotelsWithRooms,
};

export default hotelService;
