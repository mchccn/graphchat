import { Redis } from "ioredis";

const time = Date.now() * 1e3;
const start = process.hrtime();

function microtime() {
  const diff = process.hrtime(start);

  return time + diff[0] * 1e6 + Math.round(diff[1] * 1e-3);
}

const toNumber = (str: string) => parseInt(str, 10);

export default class RateLimiter {
  private client: Redis;
  private max: number;
  private duration: number;
  private namespace: string;

  constructor({
    client,
    max,
    duration,
    namespace,
  }: {
    client: Redis;
    max: number;
    duration: number;
    namespace: string;
  }) {
    this.client = client;
    this.max = max;
    this.duration = duration;
    this.namespace = namespace;
  }

  async get(id: string) {
    const key = `ratelimiter:${this.namespace}:${id}`;

    const now = microtime();

    const start = now - this.duration * 1000;

    const operations = [
      ["zremrangebyscore", key, 0, start].map(String),
      ["zcard", key].map(String),
      ["zrange", key, 0, 0].map(String),
      ["zrange", key, -this.max, -this.max].map(String),
      ["pexpire", key, this.duration].map(String),
    ];

    operations.splice(2, 0, ["zadd", key, now, now].map(String));

    const res = await this.client.multi(operations).exec();

    const count = toNumber(res[1][1]);

    const oldest = toNumber(res[3][1]);

    const oldestInRange = toNumber(res[4][1]);

    const resetMicro =
      (Number.isNaN(oldestInRange) ? oldest : oldestInRange) +
      this.duration * 1000;

    return {
      remaining: count < this.max ? this.max - count : 0,
      reset: Math.floor(resetMicro / 1000000),
      total: this.max,
    };
  }
}
