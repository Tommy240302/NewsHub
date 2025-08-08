// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { // <-- Thêm phần server này
    proxy: {
      // Cấu hình proxy cho các API của bạn
      // Mọi request bắt đầu bằng '/api' từ frontend sẽ được chuyển hướng đến backend
      '/api': {
        target: 'http://localhost:6969', // <-- Đảm bảo đây là cổng backend của bạn
        changeOrigin: true, // Thay đổi header Host của request thành target URL
        rewrite: (path) => path.replace(/^\/api/, '/api'), // Giữ nguyên '/api' trong đường dẫn khi forward
      },
      // Nếu bạn có các endpoint Auth không bắt đầu bằng /api, ví dụ: trực tiếp /auth/login
      // bạn có thể thêm một cấu hình proxy khác như sau (nếu cần):
      // '/auth': {
      //   target: 'http://localhost:6969', // Cổng backend của bạn
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/auth/, '/auth'),
      // },
    },
  },
})