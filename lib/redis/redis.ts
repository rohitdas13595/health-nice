import { Redis } from "ioredis";
import { Settings, settings } from "../settings";

const redis = new Redis({
  host: settings.redisHost,
  port: Number(settings.redisPort) || 6379,
  password: settings.redisPassword,
  username: settings.redisUsername,
});

export async function setData(key: string, value: string, ttl: number) {
  if (ttl) {
    return await redis.set(key, value, "EX", ttl);
  } else {
    return await redis.set(key, value);
  }
}


export async function getData(key: string) {
  return await redis.get(key);
}
