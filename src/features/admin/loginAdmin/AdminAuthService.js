import apiClient from '../../../api/apiClient'; // <-- Đảm bảo đường dẫn này đúng

const ADMIN_TOKEN_KEY = 'jwtToken'; // <-- Key để lưu token admin trong localStorage

const AdminAuthService = {
  async login(email, password) {
     console.log("hakdgj")
    try {
      // SỬA LỖI: Thay đổi đường dẫn từ '/api/auth/sign-in' thành '/auth/sign-in'
      // Vì apiClient đã có baseURL là '/api', nên chỉ cần phần còn lại của đường dẫn
      const response = await apiClient.post('/auth/sign-in', { email, password }); // <-- ĐÃ SỬA ĐƯỜNG DẪN
      
      if (response.data && response.data.status === 'Success' && response.data.data.token) {
        localStorage.setItem(ADMIN_TOKEN_KEY, response.data.data.token);
        console.log("hakdgj",response.data)
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Đăng nhập thất bại: Phản hồi không hợp lệ.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.errorMessage || 'Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.';
      throw new Error(errorMessage);
    }
  },

  logout() {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  },

  getCurrentAdminToken() {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  },

  isAuthenticated() {
    return !!localStorage.getItem(ADMIN_TOKEN_KEY);
  }
};

export default AdminAuthService;
