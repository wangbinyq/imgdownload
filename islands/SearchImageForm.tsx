import { ComponentProps } from "preact";
import { HiSearch } from "react-icons/hi";
import { toast } from "react-toastify";
import { useRef } from "preact/hooks";

export function SearchImageForm(
  { defaultValue, ...props }: ComponentProps<"form">,
) {
  const ref = useRef<HTMLInputElement>(null);
  const onSubmit = (e: SubmitEvent) => {
    const value = ref.current?.value;

    if (!/^https?:\/\//.test(value || "")) {
      toast.error(`Please enter a valid url`);
      e.preventDefault();
      return;
    }
  };

  return (
    <>
      <form
        onSubmit={onSubmit}
        action="/s"
        {...props}
        class="flex-1 min-w-0 max-w-prose flex relative"
      >
        <div className="absolute left-3 top-[10px] text-slate-300">
          <HiSearch size={20} />
        </div>
        <input
          ref={ref}
          placeholder="Enter any url, e.g. https://example.com"
          class="min-w-0 flex-1 h-10 border border-gray-300 outline-none rounded-full pl-10 pr-4 hover:shadow-full focus:shadow-full"
          name="url"
          type="search"
          autocomplete="off"
          value={defaultValue} // todo defaultValue
        />
      </form>
    </>
  );
}
