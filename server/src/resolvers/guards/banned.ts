import { User } from "src/entities/User";
import { UserBan } from "src/entities/UserBan";
import { Context } from "src/types";
import { NextFn, ResolverData } from "type-graphql";

export default async function CheckBans(
  { context: { req } }: ResolverData<Context>,
  next: NextFn
) {
  const user = await User.findOne({ id: req.session.user });

  if (!user) throw new Error("unauthorized");

  const bans = await UserBan.find({
    where: {
      offender: user.username,
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

  if (banned) throw new Error("user is banned");

  return next();
}
