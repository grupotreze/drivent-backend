import { createClient } from "redis";
import "dotenv/config";

const redis = createClient({
  url: process.env.REDIS_URL
});

(async () => {
  console.log("connecting redis...");
  await redis.connect();
})();

export const DEFAULT_EXP = 30;
export default redis;
