import { BlobWriter, HttpReader, ZipWriter } from "@zip-js/zip-js";
import { toast } from "react-toastify";
import { useEffect, useRef } from "preact/hooks";
import { useSignal } from "@preact/signals";

export type ImageListProps = {
  title: string;
  baseUrl: string;
  images: {
    url: string;
    src: string;
    name: string;
  }[];
};

type Image = {
  url: string;
  src: string;
  name: string;
  size?: number;
};

export default function (props: ImageListProps) {
  const images = useSignal<Image[]>(props.images);
  const ref = useRef<HTMLAnchorElement>(null);
  const href = useSignal("");

  useEffect(() => {
    images.value.forEach(async (img) => {
      const response = await fetch(img.url);
      const blob = await response.blob();
      img.size = blob.size;
    });
  });

  const onDownload = async () => {
    if (!props.images.length) {
      toast.warn(`No images found`);
      return;
    }

    const blob = new BlobWriter("application/zip");
    const zipWriter = new ZipWriter(blob);
    await Promise.all(
      Array.from(props.images).map(function (img, i) {
        zipWriter.add(
          img.name,
          new HttpReader(new URL(img.url).toString()),
        );
      }),
    );
    const result = await zipWriter.close();
    href.value = URL.createObjectURL(result);
    ref.current?.click();
  };

  return (
    <div class="my-3 p-5 rounded bg-gray-100">
      <div className="flex mb-3">
        <span>Found {props.images.length} Images</span>
        <button class="ml-auto text-gray-600" onClick={onDownload}>
          Download
        </button>
      </div>
      <div class="rounded grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {images.value.map((img) => (
          <div class="bg-white rounded-lg p-2">
            <div class="relative flex items-center justify-center overflow-hidden transition border rounded-md select-none aspect-square shrink-0 w-full bg-gray-100 border-gray-200">
              <img
                class="object-contain object-center max-w-full max-h-full"
                loading="lazy"
                src={img.url}
              />
            </div>
          </div>
        ))}
      </div>

      <a ref={ref} href={href} class="hidden" download={`${props.title}.zip`}>
      </a>
    </div>
  );
}
