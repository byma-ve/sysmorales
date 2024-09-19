import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 3000, // Ajusta el límite según tus necesidades
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          if (id.includes('src/components')) {
            return 'components';git 
          }
          if (id.includes('src/pages')) {
            return 'pages';
          }
          if (id.includes('src/utils')) {
            return 'utils';
          }
          return 'app';
        }
      }
    }
  }
});