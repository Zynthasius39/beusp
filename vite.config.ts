import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr';
import { version } from './package.json';

export default defineConfig({
  plugins: [react(), svgr()],
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router"],
          emotion: ["@emotion/react", "@emotion/styled"],
          mui: ["@mui/material", "@mui/icons-material"],
        }
      }
    }
  }
})
