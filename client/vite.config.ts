import react from "@vitejs/plugin-react";
// import path from "path";
import tailwindcss from "@tailwindcss/vite";

import { defineConfig } from "vitest/config";

export default defineConfig(() => {
  return {
    plugins: [tailwindcss(), react()],
    test: {
      environment: "jsdom",
    },

    // test: {
    //   includeSource: ["src/**/*.{js,ts,tsx}"],
    //   coverage: {
    //     reporter: ["text", "html"],
    //   },
    // },
  };
});
