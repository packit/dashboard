import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(() => ({
    plugins: [react()],
    esbuild: {
        loader: "tsx",
        include: /src\/.*\.[tj]sx?$/,
        exclude: [],
    },
    server: {
        open: true,
    },
}));
