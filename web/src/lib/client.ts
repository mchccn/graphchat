import { ApolloClient, InMemoryCache } from "@apollo/client";

const apollo = new ApolloClient({
  uri: () => `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/graphql`,
  connectToDevTools: process.env.NODE_ENV !== "production",
  cache: new InMemoryCache(),
});

export default apollo;
