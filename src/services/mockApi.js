// src/services/mockApi.js
import { v4 as uuidv4 } from 'uuid'; // Để tạo ID duy nhất cho dữ liệu mới

// Cài đặt uuid: npm install uuid
// Cài đặt types cho uuid (nếu dùng TypeScript): npm install --save-dev @types/uuid

// Dữ liệu giả lập
let mockUsers = [
  { id: "user-1", username: "admin", email: "admin@example.com", role: "admin" },
  { id: "user-2", username: "editor", email: "editor@example.com", role: "editor" },
  { id: "user-3", username: "johndoe", email: "john.doe@example.com", role: "user" },
  { id: "user-4", username: "janesmith", email: "jane.smith@example.com", role: "user" },
  { id: "user-5", username: "author1", email: "author1@example.com", role: "author" },
  { id: "user-6", username: "author2", email: "author2@example.com", role: "author" },
];

let mockPosts = [
  { id: "post-1", title: "Bài viết 1: Tóm tắt tin tức công nghệ", content: "Nội dung chi tiết...", author: "admin", category: "Công nghệ", views: 1500 },
  { id: "post-2", title: "Bài viết 2: Xu hướng phát triển kinh tế", content: "Nội dung chi tiết...", author: "editor", category: "Kinh tế", views: 2500 },
  { id: "post-3", title: "Bài viết 3: Bí quyết sống khỏe mỗi ngày", content: "Nội dung chi tiết...", author: "johndoe", category: "Sức khỏe", views: 800 },
  { id: "post-4", title: "Bài viết 4: Khám phá vũ trụ", content: "Nội dung chi tiết...", author: "author1", category: "Khoa học", views: 3200 },
  { id: "post-5", title: "Bài viết 5: Ẩm thực đường phố Việt Nam", content: "Nội dung chi tiết...", author: "author2", category: "Ẩm thực", views: 1800 },
  { id: "post-6", title: "Bài viết 6: Lập trình React từ A đến Z", content: "Nội dung chi tiết...", author: "admin", category: "Công nghệ", views: 4500 },
  { id: "post-7", title: "Bài viết 7: Thị trường chứng khoán 2025", content: "Nội dung chi tiết...", author: "editor", category: "Kinh tế", views: 2100 },
];

// Dữ liệu giả lập cho doanh thu tác giả
let mockAuthorRevenue = [
  { author: "admin", revenue: 5000000 },
  { author: "editor", revenue: 3000000 },
  { author: "johndoe", revenue: 1500000 },
  { author: "author1", revenue: 7000000 },
  { author: "author2", revenue: 2500000 },
];


const MOCK_API_DELAY = 500; // Độ trễ giả lập cho API

const api = {
  // Hàm GET giả lập
  get: (url) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (url === '/users') {
          resolve({ status: 200, data: mockUsers });
        } else if (url === '/posts') {
          resolve({ status: 200, data: mockPosts });
        } else if (url === '/admin/statistics/author-revenue') {
          resolve({ status: 200, data: mockAuthorRevenue });
        } else if (url === '/admin/statistics/most-viewed-posts') {
          const sortedPosts = [...mockPosts].sort((a, b) => b.views - a.views);
          resolve({ status: 200, data: sortedPosts.slice(0, 5) });
        }
        else {
          console.error(`Mock API: URL không được xử lý: ${url}`);
          reject({ status: 404, message: `API Endpoint Not Found: ${url}` });
        }
      }, MOCK_API_DELAY);
    });
  },

  // Hàm POST giả lập (ví dụ cho đăng nhập và THÊM MỚI)
  post: (url, data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (url === '/auth/admin/login') {
          if (data.username === 'admin' && data.password === 'admin') {
            resolve({ status: 200, data: { token: 'mock_admin_token_123' } });
          } else {
            reject({ status: 401, message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
          }
        } else if (url === '/auth/login') {
          const user = mockUsers.find(u => u.username === data.username && u.password === data.password);
          if (user) {
            resolve({ status: 200, data: { token: `mock_user_token_${user.id}`, user: user } });
          } else {
            reject({ status: 401, message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
          }
        } else if (url === '/auth/signup') {
          const newUser = { id: uuidv4(), username: data.username, email: data.email, password: data.password, role: 'user' };
          mockUsers.push(newUser);
          resolve({ status: 201, data: { message: 'Đăng ký thành công', user: newUser } });
        }
        // Thêm endpoint POST mới cho Users (admin thêm user)
        else if (url === '/users') {
          // Admin thêm người dùng thì không cần password phức tạp, có thể tạo ngẫu nhiên hoặc bỏ qua
          const newUser = {
            id: uuidv4(),
            username: data.username,
            email: data.email,
            role: data.role || 'user', // Mặc định role là 'user' nếu không cung cấp
            password: data.password || 'default_password' // Đặt mật khẩu mặc định hoặc tạo ngẫu nhiên
          };
          mockUsers.push(newUser);
          resolve({ status: 201, data: newUser }); // Trả về người dùng đã tạo
        }
        // Thêm endpoint POST mới cho Posts
        else if (url === '/posts') {
          const newPost = {
            id: uuidv4(),
            title: data.title,
            content: data.content,
            author: data.author,
            category: data.category,
            views: data.views || 0, // Mặc định lượt xem là 0
          };
          mockPosts.push(newPost);
          resolve({ status: 201, data: newPost }); // Trả về bài viết đã tạo
        }
        else {
          console.error(`Mock API: URL POST không được xử lý: ${url}`);
          reject({ status: 404, message: `API POST Endpoint Not Found: ${url}` });
        }
      }, MOCK_API_DELAY);
    });
  },

  // Hàm PUT giả lập (ví dụ cho cập nhật)
  put: (url, data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (url.startsWith('/users/')) {
          const userId = url.split('/').pop();
          const userIndex = mockUsers.findIndex(u => u.id === userId);
          if (userIndex !== -1) {
            mockUsers[userIndex] = { ...mockUsers[userIndex], ...data };
            resolve({ status: 200, data: mockUsers[userIndex] });
          } else {
            reject({ status: 404, message: 'User not found' });
          }
        } else if (url.startsWith('/posts/')) {
          const postId = url.split('/').pop();
          const postIndex = mockPosts.findIndex(p => p.id === postId);
          if (postIndex !== -1) {
            mockPosts[postIndex] = { ...mockPosts[postIndex], ...data };
            resolve({ status: 200, data: mockPosts[postIndex] });
          } else {
            reject({ status: 404, message: 'Post not found' });
          }
        }
        else {
          console.error(`Mock API: URL PUT không được xử lý: ${url}`);
          reject({ status: 404, message: `API PUT Endpoint Not Found: ${url}` });
        }
      }, MOCK_API_DELAY);
    });
  },

  // Hàm DELETE giả lập
  delete: (url) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (url.startsWith('/users/')) {
          const userId = url.split('/').pop();
          const initialLength = mockUsers.length;
          mockUsers = mockUsers.filter(u => u.id !== userId);
          if (mockUsers.length < initialLength) {
            resolve({ status: 200, message: 'User deleted' });
          } else {
            reject({ status: 404, message: 'User not found' });
          }
        } else if (url.startsWith('/posts/')) {
          const postId = url.split('/').pop();
          const initialLength = mockPosts.length;
          mockPosts = mockPosts.filter(p => p.id !== postId);
          if (mockPosts.length < initialLength) {
            resolve({ status: 200, message: 'Post deleted' });
          } else {
            reject({ status: 404, message: 'Post not found' });
          }
        }
        else {
          console.error(`Mock API: URL DELETE không được xử lý: ${url}`);
          reject({ status: 404, message: `API DELETE Endpoint Not Found: ${url}` });
        }
      }, MOCK_API_DELAY);
    });
  },
};

export default api;