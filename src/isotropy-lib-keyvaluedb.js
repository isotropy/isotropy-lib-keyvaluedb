import Redis from "ioredis";

const objectFlattener = obj =>
  Object.keys(obj).reduce((acc, cur) => acc.concat(cur).concat(obj[cur]), []);

const pipeLiner = (redis, setKey, values, operation) => {
  const pipeline = redis.pipeline();
  if (operation === "hset")
    Object.keys(values).forEach(key =>
      pipeline[operation](setKey, key, values[key])
    );
  if (operation === "sadd")
    values.forEach(value => pipeline[operation](setKey, value));
  return pipeline.exec((err, result) => result);
};

export async function put(connStr, data) {
  const redis = new Redis(connStr);
  return typeof data.value === "object"
    ? data.value instanceof Array
      ? await pipeLiner(redis, data.key, data.value, "sadd")
      : await pipeLiner(redis, data.key, data.value, "hset")
    : await redis.set(data.key, data.value);
}

export async function get(connStr, key) {
  const redis = new Redis(connStr);
  return await redis.get(key);
}

export async function hget(connStr, hash, key) {
  const redis = new Redis(connStr);
  return await redis.hget(hash, key);
}

export async function sget(connStr, set) {
  const redis = new Redis(connStr);
  return await redis.smembers(set);
}

export async function del(connStr, data) {
  const redis = new Redis(connStr);
  return await redis.del(data);
}

export async function flushdb(connStr) {
  const redis = new Redis(connStr);
  return await redis.flushdb();
}

export async function exists(connStr, data) {
  const redis = new Redis(connStr);
  return await redis.exists(data);
}

export async function scan(connStr) {
  const redis = new Redis(connStr);
  return await redis.scan(connStr);
}
