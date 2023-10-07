import react from "@vitejs/plugin-react";
import viteCompression from 'vite-plugin-compression';
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), viteCompression()],
  root: "frontend",
  build: {
    outDir: process.cwd() + "/public",
    emptyOutDir: true,
  }
});
