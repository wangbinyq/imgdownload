import { ComponentProps } from "preact";

export function Logo(props: ComponentProps<"div">) {
  return (
    <div
      class={`${props.class || ""} flex items-center leading-tight select-none`}
    >
      <span class="text-slate-500 bg-white mr-1">IMAGE</span>
      <span class="text-white bg-slate-500 p-1 ml-1">DOWNLOAD</span>
    </div>
  );
}
