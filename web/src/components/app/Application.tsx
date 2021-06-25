import { useMeQuery } from "../../generated/graphql";
import Profile from "./Profile";

export default function Application({
  user,
}: {
  user: Exclude<Exclude<ReturnType<typeof useMeQuery>["data"], undefined>["me"], undefined | null>;
}) {
  return (
    <div>
      <Profile user={user} />
    </div>
  );
}
