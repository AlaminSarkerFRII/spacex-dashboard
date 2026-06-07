import { ApolloClient, InMemoryCache } from "@apollo/experimental-nextjs-app-support";
import { HttpLink } from "@apollo/client";

const SPACEX_GRAPHQL_API = "/api/graphql";

export function makeClient() {
  const httpLink = new HttpLink({
    uri: SPACEX_GRAPHQL_API,
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: httpLink,
  });
}
