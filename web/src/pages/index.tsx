import { useEffect } from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";

const Index = () => {
  const { data = {} } = useMeQuery();

  const [logout, _] = useLogoutMutation();

  useEffect(() => {
    console.log(data.me);
  }, []);

  return (
    <div className="w-full h-full grid grid-cols-3 gap-4 text-center">
      <div>
        <h2>Left</h2>
      </div>
      <div>
        <h2>Center</h2>
        <h2>{data.me!.username}</h2>
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
      <div>
        <h2>Right</h2>
      </div>
    </div>
  );
};

export default Index;
