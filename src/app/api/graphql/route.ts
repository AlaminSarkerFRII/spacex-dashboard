import { createYoga } from "graphql-yoga";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { typeDefs } from "@/graphql/schema";
import { resolvers } from "@/graphql/resolvers";
import { NextRequest } from "next/server";

const schema = makeExecutableSchema({ typeDefs, resolvers });

const yoga = createYoga({
  schema,
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Response },
});

export async function GET(request: NextRequest) {
  return yoga.fetch(request);
}

export async function POST(request: NextRequest) {
  return yoga.fetch(request);
}
