import { type Config } from "tailwindcss";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        "full": "0 1px 6px rgba(32,33,36,.28)",
      },
    },
  },
} satisfies Config;
