import { User } from "src/entities/User";
import { Context } from "src/types";
import { queryError, wrapErrors } from "src/utils/errors";
import { NextFn, ResolverData } from "type-graphql";

export default async function AdminPerms(
  { context: { req } }: ResolverData<Context>,
  next: NextFn
) {
  const moderator = await User.findOne(req.session.user);

  if (!moderator) throw new Error("unauthorized");

  if (!["sysadmin", "administrator", "moderator"].includes(moderator.role))
    return wrapErrors(queryError(403, "forbidden"));

  return next();
}
