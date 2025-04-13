import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Add server configuration
    proxy: {
      // Proxy requests starting with /api to your backend server
      "/api": {
        target: "http://localhost:6600", // Your backend API server address from docker-compose
        changeOrigin: true, // Recommended for virtual hosted sites
        secure: false, // Set to false if your backend server uses http (not https)
        // Optional: rewrite path if your backend doesn't expect '/api' prefix
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
