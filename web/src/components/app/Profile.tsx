import { useMeQuery } from "../../generated/graphql";

export default function Profile({
  user,
}: {
  user: Exclude<Exclude<ReturnType<typeof useMeQuery>["data"], undefined>["me"], undefined | null>;
}) {
  return (
    <a href="/profile">
      <div className="flex items-center gap-2 p-2 bg-primary-800 w-96">
        <img className="w-8 h-8" src={user.avatar} alt="" />
        <p>{user.username}</p>
      </div>
    </a>
  );
}
