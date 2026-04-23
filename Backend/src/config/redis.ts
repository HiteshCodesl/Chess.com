import {Redis} from "ioredis"

export const redis = new Redis({
    port: 6379,
    host: "127.0.0.1"
})

redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on("error", (err) => {
  console.log("Redis error:", err);
});