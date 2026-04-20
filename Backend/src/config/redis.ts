import {Redis} from "ioredis"

export const redis = new Redis({
    port: 6379,
    host: "localhost"
})

redis.on("connect", () => {
  console.log("Redis connected");
});