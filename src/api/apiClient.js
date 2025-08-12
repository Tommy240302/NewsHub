import axios from 'axios';

// Tạo một instance Axios
const apiClient = axios.create({
  baseURL: '/api', // Base URL cho các API của bạn. Vite proxy sẽ chuyển hướng nó.
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để tự động thêm JWT token vào header Authorization cho mỗi request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken'); // Lấy token từ localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý lỗi phản hồi (ví dụ: 401 Unauthorized)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Xử lý khi token hết hạn hoặc không hợp lệ
      // Ví dụ: xóa token và chuyển hướng người dùng về trang đăng nhập
      localStorage.removeItem('jwtToken');
      console.log('Token hết hạn hoặc không hợp lệ. Đang chuyển hướng đến trang đăng nhập...');
      // Bạn có thể thêm logic chuyển hướng ở đây, ví dụ:
      // window.location.href = '/login'; // Nếu bạn không dùng React Router
      // navigate('/login'); // Nếu bạn dùng React Router (cần useContext hoặc hook)
    }
    return Promise.reject(error);
  }
);

export default apiClient;