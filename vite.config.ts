import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          emotion: ["@emotion/react", "@emotion/styled"],
          mui: ["@mui/material", "@mui/icons-material", "@mui/x-date-pickers"],
        }
      }
    }
  }
})
