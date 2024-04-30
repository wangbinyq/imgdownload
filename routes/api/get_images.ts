import { FreshContext } from "$fresh/server.ts";
import { DOMParser, Element } from "@b-fuze/deno-dom";

export type GetImagesResult = {
  images: string[];
  title: string;
};

export const handler = async (
  _req: Request,
  ctx: FreshContext,
): Promise<Response> => {
  const url = ctx.url.searchParams.get("url")!;
  const html = await fetch(url).then((res) => res.text());
  const parser = new DOMParser();
  const dom = parser.parseFromString(html, "text/html")!;
  const images = Array.from(
    new Set(
      Array.from(dom.querySelectorAll("img")).flatMap((img) =>
        (img as unknown as Element).getAttribute("src") as string
      ).filter((src) => !src.startsWith("data")),
    ),
  );
  const title = dom.querySelector("title")?.textContent || "";

  return Response.json({
    images,
    title,
  });
};
