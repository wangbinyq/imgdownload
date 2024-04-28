import { ComponentProps } from "https://esm.sh/v128/preact@10.19.6/src/index.js";

export type Props = ComponentProps<"form">;

export function SearchImageForm({ defaultValue, ...props }: Props) {
  return (
    <form action="/s" {...props}>
      <input
        name="url"
        type="search"
        autocomplete="off"
        defaultValue={defaultValue}
      />
      <button type="submit">Search</button>
    </form>
  );
}
