import { Context } from "src/types";
import { queryError, wrapErrors } from "src/utils/errors";
import RateLimiter from "src/utils/RateLimiter";
import { NextFn, ResolverData } from "type-graphql";
import { client } from "../../app";

export default async function RateLimit({
  duration,
  max,
  namespace,
}: {
  duration: number;
  max: number;
  namespace: string;
}) {
  const limiter = new RateLimiter({ client, duration, max, namespace });

  return async function (
    { context: { req, res } }: ResolverData<Context>,
    next: NextFn
  ) {
    const forwarded = req.headers["x-forwarded-for"];

    const { remaining, reset, total } = await limiter.get(
      req.session.user ??
        (forwarded
          ? Array.isArray(forwarded)
            ? forwarded[0]
            : forwarded.split(/, /)[0]
          : req.ip)
    );

    res.header("X-RateLimit-Limit", total.toString());
    res.header("X-RateLimit-Remaining", (remaining - 1).toString());
    res.header("X-RateLimit-Reset", reset.toString());

    if (remaining <= 0) {
      const after = (reset - Date.now() / 1000) | 0;

      res.set("Retry-After", after.toString());

      return wrapErrors(queryError(429, `rate limit exceeded`));
    }

    return next();
  };
}
