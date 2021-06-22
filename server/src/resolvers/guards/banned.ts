import { User } from "src/entities/User";
import { UserBan } from "src/entities/UserBan";
import { Context } from "src/types";
import { queryError, wrapErrors } from "src/utils/errors";
import { NextFn, ResolverData } from "type-graphql";

export default async function CheckBans(
  { context: { req } }: ResolverData<Context>,
  next: NextFn
) {
  const user = await User.findOne({ id: req.session.user });

  if (!user) return wrapErrors(queryError(401, "unauthorized"));

  const bans = await UserBan.find({
    where: {
      offenderId: user.id,
    },
  });

  const banned = bans.reduce((banned, ban) => {
    if (banned) return banned;

    if (Date.now() >= ban.expires.getTime()) {
      UserBan.delete(ban);
      return banned;
    }

    return true;
  }, false);

  if (banned) return wrapErrors(queryError(403, "user is banned"));

  return next();
}
