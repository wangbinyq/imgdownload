import { type PageProps } from "$fresh/server.ts";
import ToastContainer from "../islands/ToastContainer.tsx";
export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>imgdownload</title>
        <link rel="stylesheet" href="/styles.css" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/react-toastify@10.0.5/dist/ReactToastify.min.css"
        />
      </head>
      <body class="container mx-auto px-2">
        <Component />
        <ToastContainer autoClose={3000} />
      </body>
    </html>
  );
}
