/* eslint-disable boundaries/element-types */
import { notFoundError } from "@/errors";
import eventRepository from "@/repositories/event-repository";
import { exclude } from "@/utils/prisma-utils";
import { Event } from "@prisma/client";
import dayjs from "dayjs";
import redis, { DEFAULT_EXP } from "@/config/redis";

async function getFirstEvent(): Promise<GetFirstEventResult> {
  const cacheKey = "getFirstEvent";
  const cachedEvent = await redis.get(cacheKey);

  if (cachedEvent) return JSON.parse(cachedEvent);

  const event = await eventRepository.findFirst();
  if (!event) throw notFoundError();

  const cachedResult = exclude(event, "createdAt", "updatedAt");
  redis.setEx(cacheKey, DEFAULT_EXP, JSON.stringify(cachedResult));
  return exclude(event, "createdAt", "updatedAt");
}

export type GetFirstEventResult = Omit<Event, "createdAt" | "updatedAt">;

async function isCurrentEventActive(): Promise<boolean> {
  const cacheKey = "isCurrentEventActive";
  const cachedCurrentEventActive = await redis.get(cacheKey);

  if (cachedCurrentEventActive) return JSON.parse(cachedCurrentEventActive);

  const event = await eventRepository.findFirst();
  if (!event) return false;

  const now = dayjs();
  const eventStartsAt = dayjs(event.startsAt);
  const eventEndsAt = dayjs(event.endsAt);

  const returnValue = now.isAfter(eventStartsAt) && now.isBefore(eventEndsAt);

  redis.setEx(cacheKey, DEFAULT_EXP, JSON.stringify(returnValue));
  return returnValue;
}

const eventsService = {
  getFirstEvent,
  isCurrentEventActive,
};

export default eventsService;
