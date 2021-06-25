import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache, split } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import type { AppProps } from "next/app";

const http = new HttpLink({
  uri: `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/graphql`,
  credentials: "include",
});

const ws = new WebSocketLink({
  uri: `${process.env.NEXT_PUBLIC_WSS_ADDRESS}/subscriptions`,
  options: {
    reconnect: true,
  },
});

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);

    return definition.kind === "OperationDefinition" && definition.operation === "subscription";
  },
  ws,
  http
);

const cache = new InMemoryCache();

const client = new ApolloClient({ cache, link });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
