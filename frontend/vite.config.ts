import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom"]
  },
  server: {
    proxy: {
      "/movies": "http://127.0.0.1:4000",
      "/recommendations": "http://127.0.0.1:4000",
      "/feedback": "http://127.0.0.1:4000",
      "/tmdb": "http://127.0.0.1:4000",
      "/health": "http://127.0.0.1:4000"
    }
  }
});
