import "server-only";

export class GraphQLRequestError extends Error {
  constructor(readonly code: string, message: string) {
    super(message);
    this.name = "GraphQLRequestError";
  }
}

/** Calls the API with the viewer's token. */
export async function graphql<T>(accessToken: string, query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const response = await fetch(process.env.API_GRAPHQL_ENDPOINT ?? "http://localhost:8087/api/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  if (response.status === 401 || response.status === 403) {
    throw new GraphQLRequestError("FORBIDDEN", "Not allowed");
  }

  const body = (await response.json()) as { data?: T; errors?: { message: string; extensions?: { classification?: string } }[] };

  if (body.errors?.length) {
    throw new GraphQLRequestError(body.errors[0].extensions?.classification ?? "INTERNAL_ERROR", body.errors[0].message);
  }
  return body.data as T;
}
