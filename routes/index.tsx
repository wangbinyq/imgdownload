import { Logo } from "../components/Logo.tsx";
import { SearchImageForm } from "../islands/SearchImageForm.tsx";

export default function Home() {
  return (
    <div class="h-screen flex flex-col justify-center pb-[30vh]">
      <div class="flex justify-center mb-6">
        <a href="/">
          <Logo class="text-2xl" />
        </a>
      </div>
      <div class="flex justify-center px-4 mb-6">
        <SearchImageForm />
      </div>
    </div>
  );
}
