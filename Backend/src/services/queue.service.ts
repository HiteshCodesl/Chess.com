import { redis } from "../config/redis.js";

const QUEUE_KEY = 'matchmaking:queue';

export const addUserToQueue = async (userId: string) => {
    await redis.lpush(QUEUE_KEY, userId);
}

export const getFromMatchMakingQueue = async(): Promise<string | null> => {
    return await redis.rpop(QUEUE_KEY);
};