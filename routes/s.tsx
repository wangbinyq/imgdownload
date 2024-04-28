import { FreshContext } from "$fresh/server.ts";
import ImageList, { ImageListProps } from "../islands/ImageList.tsx";
import { SearchImageForm } from "../partials/SearchImageForm.tsx";
import { DOMParser, Element } from "@b-fuze/deno-dom";

export default async function (req: Request, ctx: FreshContext) {
  const query = ctx.url.searchParams;

  let error;
  let url = "";
  let title = "";
  let images = [] as ImageListProps["images"];
  try {
    url = new URL(query.get("url") as string).toString();
  } catch (e) {
    error = new Error("Invalid URL");
  }

  if (url) {
    try {
      const html = await fetch(url).then((res) => res.text());
      const parser = new DOMParser();
      const dom = parser.parseFromString(html, "text/html")!;
      images = Array.from(
        new Set(
          Array.from(dom.querySelectorAll("img")).flatMap((img) =>
            (img as unknown as Element).getAttribute("src") as string
          ).filter((src) => !src.startsWith("data")).map((src) => ({
            src,
            name: new URL(src, url).pathname.split("/").slice(-1)[0],
          })),
        ),
      );
      title = dom.querySelector("title")?.textContent || "";
    } catch (e) {
      error = new Error("Can't find images from this url");
    }
  }

  return (
    <>
      {error && <p>{error.message}</p>}
      <SearchImageForm defaultValue={url} />
      <ImageList images={images} baseUrl={url} title={title} />
    </>
  );
}
