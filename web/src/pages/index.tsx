import Application from "../components/app/Application";
import { useMeQuery } from "../generated/graphql";

export default function Index() {
  const me = useMeQuery();

  if (!me.data?.me) return <div></div>;

  return <Application />;
}
