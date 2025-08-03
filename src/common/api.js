import axios from 'axios';

// Tạo instance axios với cấu hình mặc định
const api = axios.create({
  baseURL: 'http://localhost:6969/api', 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - thêm token vào header nếu có
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => { // Trường thành thành công status code 2xx 3xx 
    return response.data; 
    // { 
    //   "data": T, 
    //   "message": T, 
    //   "errorMessage": T
    //   "status": Success / Fail 
    // }
  },
  (error) => {
    // Xử lý lỗi 401 - Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Có thể redirect về trang login
      window.location.href = '/login';
    }
    
    // Xử lý lỗi 403 - Forbidden
    else if (error.response?.status === 403) {
      console.error('Access denied');
      window.localStorage.href = '/access-denied'; 
    }
    
    return Promise.reject(error);
  }
);

// API functions
export const authAPI = {
  // Đăng nhập
  login: (credentials) => api.post('/auth/sign-in', credentials),
  
  // Đăng ký
  register: (userData) => api.post('/auth/register', userData),
  
  // Đăng xuất
  logout: () => api.post('/auth/logout'),
  
  // Refresh token
  refreshToken: () => api.post('/auth/refresh'),
  
  // Quên mật khẩu
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  
  // Reset mật khẩu
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword }),

};

export const userAPI = {
  getDetailUser: (id) => api.get('/users/' + id),
  // Lấy user profile của user đang đăng nhập qua endpoint /users/me
  getMe: () => api.get('/users/me'),
};

export const authorAPI = {
  createnews: (news) => api.post('/author/create', news)
};


export const newsAPI = {
  getAllNews: () => api.get('/news'),
};

export const categoryAPI = {
  getAllCategories: () => api.get('/categories'),
};

export const userAPI = {
  requestAuthor: (requestAuthor) => api.post('/users/request-author', requestAuthor)
}

export default api; 