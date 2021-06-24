import { useEffect } from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";

const Index = () => {
  const { data = {} } = useMeQuery();

  const [logout, _] = useLogoutMutation();

  useEffect(() => {
    console.log(data.me);
  }, []);

  if (!data.me)
    return (
      <div>
        <a className="text-lg" href="/auth/login">
          Click to sign in
        </a>
      </div>
    );

  return (
    <div className="h-full w-full grid place-items-center">
      <h1 className="text-primary-100">Reanvue</h1>
      <div>
        <div>
          <h2>Logged in as {data.me.username}</h2>
        </div>
        <a
          className="text-lg"
          href=""
          onClick={async (e) => {
            e.preventDefault();

            const data = await logout();

            console.log(data);

            return location.reload();
          }}
        >
          Click to logout
        </a>
      </div>
    </div>
  );
};

export default Index;
