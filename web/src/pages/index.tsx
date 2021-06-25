import Application from "../components/app/Application";
import { useMeQuery } from "../generated/graphql";

export default function Index() {
  const me = useMeQuery();

  if (me.loading) return null;

  if (!me.data?.me || me.error)
    return (
      <div
        className="absolute h-screen w-screen grid place-content-center"
        style={{
          background: "url(/gql-bg.png)",
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
          backgroundSize: "900px 450px",
          animation: "move-background 10000s linear infinite",
        }}
      >
        <div className="flex flex-col items-center">
          <img src="/icon.svg" alt="graphql icon" />
          <h1>graphchat</h1>
          <p className="text-primary-100">
            real time chat with{" "}
            <a href="https://graphql.org/" className="text-accent-hover">
              graphql
            </a>
          </p>
          <div className="w-52 mt-6 flex items-center justify-between">
            <a href="/login" className="rounded uppercase bg-accent px-3 py-2">
              Log in
            </a>
            <a href="/register" className="rounded uppercase bg-accent px-3 py-2">
              Register
            </a>
          </div>
        </div>
      </div>
    );

  return <Application user={me.data.me!} />;
}
