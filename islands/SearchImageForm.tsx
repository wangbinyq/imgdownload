import { ComponentProps } from "preact";
import { HiSearch } from "react-icons/hi";
import { useSignal } from "@preact/signals";
import { useRef } from "preact/hooks";
import { toast, ToastContainer } from "react-toastify";
import { BlobWriter, HttpReader, ZipWriter } from "@zip-js/zip-js";
import { GetImagesResult } from "../routes/api/get_images.ts";

export function SearchImageForm(
  { defaultValue, ...props }: ComponentProps<"form">,
) {
  const ref = useRef<HTMLAnchorElement>(null);
  const url = useSignal("");
  const title = useSignal("");
  const href = useSignal("");
  const downloading = useSignal(false);
  let images = [];

  const onDownload = async () => {
    const waitForToast = new Promise<void>((resolve) =>
      setTimeout(() => resolve(), 3000)
    );
    const toastId = toast.info(`Downloading...`, {
      closeButton: false,
      autoClose: false,
    });

    try {
      if (downloading.peek()) {
        toast.update(toastId, {
          render: "Wait for the current download to complete",
          closeButton: true,
          type: "warning",
        });
        return;
      }

      if (!/^https?:\/\//.test(url.value)) {
        toast.update(toastId, {
          render: "Please enter a valid url",
          closeButton: true,
          type: "error",
        });
        return;
      }

      downloading.value = true;
      const getResult: GetImagesResult = await fetch(
        `/api/get_images?url=${encodeURIComponent(url.value)}`,
      ).then((res) => res.json());

      images = getResult.images.map((src) => ({
        url: `/i?src=${encodeURIComponent(src)}&base=${
          encodeURIComponent(url.value)
        }`,
        src,
        name: new URL(src, url.value).pathname.split("/").pop(),
      }));
      title.value = getResult.title;

      if (images.length === 0) {
        toast.update(toastId, {
          render: `No images found`,
          closeButton: true,
          type: "warning",
        });
        return;
      } else {
        toast.update(toastId, {
          render: `Found ${images.length} images`,
          closeButton: false,
          type: "info",
        });
      }
      let downloaded = 0;

      const blob = new BlobWriter("application/zip");
      const zipWriter = new ZipWriter(blob);
      await Promise.all(
        Array.from(images).map(function (img, i) {
          zipWriter.add(
            i + 1 + "-" + img.name,
            new HttpReader(img.url),
          ).then(() => {
            downloaded += 1;
            toast.update(toastId, {
              render: `Downloaded ${downloaded}/${images.length} images`,
              closeButton: false,
              type: "info",
            });
          });
        }),
      );
      const result = await zipWriter.close();
      href.value = URL.createObjectURL(result);
      ref.current?.click();
    } catch (e) {
      toast.update(toastId, {
        render: `Can't find images from this url`,
        closeButton: true,
        type: "error",
      });
    } finally {
      await waitForToast;
      toast.dismiss(toastId);
      downloading.value = false;
    }
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onDownload();
        }}
        {...props}
        class="flex-1 min-w-0 max-w-prose flex relative"
      >
        <div className="absolute left-3 top-[10px] text-slate-300">
          <HiSearch size={20} />
        </div>
        <input
          disabled={downloading.value}
          placeholder="Enter any url, e.g. https://example.com"
          class="min-w-0 flex-1 h-10 border border-gray-300 outline-none rounded-full pl-10 pr-4 hover:shadow-full focus:shadow-full"
          name="url"
          type="search"
          autocomplete="off"
          onChange={(e) => (url.value = e.currentTarget.value)}
          value={url.value} // todo defaultValue
        />
      </form>
      <ToastContainer autoClose={3000} />
      <a ref={ref} href={href} class="hidden" download={`${title}.zip`}>
      </a>
    </>
  );
}
