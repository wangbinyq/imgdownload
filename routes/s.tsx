import { FreshContext } from "$fresh/server.ts";
import { Logo } from "../components/Logo.tsx";
import ImageList, { ImageListProps } from "../islands/ImageList.tsx";
import PageToast from "../islands/PageToast.tsx";
import { SearchImageForm } from "../islands/SearchImageForm.tsx";
import { DOMParser, Element } from "@b-fuze/deno-dom";

export default async function (req: Request, ctx: FreshContext) {
  const query = ctx.url.searchParams;

  let error, warn;
  let url = "";
  let title = "";
  let images = [] as ImageListProps["images"];
  try {
    const u = query.get("url") as string;
    if (!u) {
      return Response.redirect(new URL("/", ctx.url));
    }
    url = new URL(u).toString();
  } catch (e) {
    error = "Invalid URL";
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

      if (images.length === 0) {
        warn = `No images found`;
      }
    } catch (e) {
      error = "Can't find images from this url";
    }
  }

  return (
    <>
      <PageToast error={error} warn={warn} />
      <header class="flex items-center py-2">
        <a href="/" class="mr-auto pr-2">
          <Logo />
        </a>
        <SearchImageForm defaultValue={url} />
      </header>
      <ImageList images={images} baseUrl={url} title={title} />
    </>
  );
}
