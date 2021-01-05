import redis from 'redis';
import asyncRedis from 'async-redis';

const redisClient = redis.createClient({
  host: 'redis',
  port: 6379,
  password: 'gardenbar_admin',
});

redisClient.on("error", function (err) {
  console.log("Error " + err);
});

const asyncRedisClient = asyncRedis.decorate(redisClient);

export {
  redisClient,
  asyncRedisClient,
}