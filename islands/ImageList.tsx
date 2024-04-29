import { BlobWriter, HttpReader, ZipWriter } from "@zip-js/zip-js";
import { useRef } from "preact/hooks";
import { useSignal } from "@preact/signals";

export type ImageListProps = {
  title: string;
  baseUrl: string;
  images: {
    src: string;
    name: string;
  }[];
};

export default function (props: ImageListProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const href = useSignal("");

  const onDownload = async () => {
    const blob = new BlobWriter("application/zip");
    const zipWriter = new ZipWriter(blob);
    await Promise.all(
      Array.from(props.images).map(function (img, i) {
        const url = new URL(img.src, props.baseUrl);
        zipWriter.add(
          img.name,
          new HttpReader(url.toString()),
        );
      }),
    );
    const result = await zipWriter.close();
    href.value = URL.createObjectURL(result);
    ref.current?.click();
  };

  return (
    <div>
      <div>
        {props.images.map((img) => (
          <img
            loading="lazy"
            src={`/i/?src=${encodeURIComponent(img.src)}&base=${
              encodeURIComponent(props.baseUrl)
            }`}
          />
        ))}
      </div>

      {props.images.length > 0 && (
        <button onClick={onDownload}>
          Download
        </button>
      )}

      <a ref={ref} href={href} class="hidden" download={`${props.title}.zip`}>
      </a>
    </div>
  );
}
