import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache, split } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import type { AppProps } from "next/app";
import Head from "next/head";
import "../style.css";

const http = new HttpLink({
  uri: `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/graphql`,
  credentials: "include",
});

const ws = process.browser
  ? new WebSocketLink({
      uri: `${process.env.NEXT_PUBLIC_WSS_ADDRESS}/subscriptions`,
      options: {
        reconnect: true,
      },
    })
  : undefined;

const link = process.browser
  ? split(
      ({ query }) => {
        const definition = getMainDefinition(query);

        return definition.kind === "OperationDefinition" && definition.operation === "subscription";
      },
      ws!,
      http
    )
  : http;

const cache = new InMemoryCache();

const client = new ApolloClient({ cache, link });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="real time chat with graphql" />
        <meta name="keywords" content="lynix" />
        <meta name="author" content="cursorsdottsx" />
        <meta name="robots" content="follow" />
        <meta name="theme-color" content="#000000" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
        <meta property="og:site_name" content="graphchat" />
        <meta property="og:keywords" content="graphchat graphql chat" />
        <meta property="og:locale" content="en-US" />
        <meta property="og:title" content="graphchat" />
        <meta property="og:description" content="real time chat with graphql" />
        <meta
          property="og:image"
          content="https://og-image.vercel.app/graph**chat**.png?theme=light&md=1&fontSize=125px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg&heights=350"
        />
        <title>graphchat</title>
        <link rel="shortcut icon" href="icon.svg" type="image/x-icon" />
      </Head>
      <ApolloProvider client={client}>
        <Component {...pageProps} />
      </ApolloProvider>
    </>
  );
}
