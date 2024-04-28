import { Handler } from "$fresh/server.ts";

export const handler: Handler = (_, ctx) => {
  const query = ctx.url.searchParams;
  const baseUrl = query.get("base")!;
  const src = query.get("src")!;
  const url = new URL(src, baseUrl);
  return fetch(url, {
    referrer: baseUrl,
  });
};
