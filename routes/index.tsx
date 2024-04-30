import { SearchImageForm } from "../islands/SearchImageForm.tsx";

export default function Home() {
  return (
    <div class="h-screen flex flex-col justify-center pb-[30vh]">
      <div class="flex justify-center mb-6">
        <a href="/">
          <div class="text-2xl flex items-center leading-tight select-none">
            <span class="text-slate-500 bg-white mr-1">IMAGE</span>
            <span class="text-white bg-slate-500 p-1 ml-1">DOWNLOAD</span>
          </div>
        </a>
      </div>
      <div class="flex justify-center px-4 mb-6">
        <SearchImageForm />
      </div>
    </div>
  );
}
