import { ApolloProvider } from "@apollo/client";
import type { AppProps } from "next/app";
import React from "react";
import apollo from "../lib/client";
import "../styles/style.css";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ApolloProvider client={apollo}>
      <Component {...pageProps} />;
    </ApolloProvider>
  );
};

export default App;
