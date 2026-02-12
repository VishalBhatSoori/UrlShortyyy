import Redis from 'ioredis';

declare global {
  var redis: Redis | undefined;
}

const getRedisClient = (): Redis => {
  if (process.env.REDIS_URL) {
    return new Redis(process.env.REDIS_URL, {
      connectTimeout: 10000, 
      maxRetriesPerRequest: 3,
    });
  }
  throw new Error("REDIS_URL is not defined in environment variables");
};

const redis = global.redis || getRedisClient();

if (process.env.NODE_ENV !== 'production') {
  global.redis = redis;
}

export default redis;