import { useEffect } from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";

const Index = () => {
  const { data = {} } = useMeQuery();

  const [logout, _] = useLogoutMutation();

  useEffect(() => {
    console.log(data.me);
  }, []);

  return (
    <div className="w-full h-full grid place-items-center text-center">
      {data.me ? (
        <div>
          <h1>{data.me.username}</h1>
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
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Index;
