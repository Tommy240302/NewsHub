
# News Website Frontend (ReactJS)

## Giới thiệu
Đây là phần **frontend** của hệ thống website tin tức với hỗ trợ AI trong quản lý bình luận.  
Frontend được xây dựng bằng **ReactJS**, cung cấp giao diện cho người dùng (Reader, Author, Admin) và giao tiếp với backend qua REST API.

---

## Công nghệ sử dụng
- **ReactJS**
- **React Router** (điều hướng)
- **Axios** (gọi API)
- **Ant Design** (UI components)
- **JavaScript (ES6+)**

---

## Chức năng chính
### Reader
- Đăng ký / đăng nhập  
- Xem tin tức theo chuyên mục  
- Bình luận (AI kiểm duyệt trước khi hiển thị)  

### Author
- Soạn và đăng bài viết  
- Quản lý bài viết cá nhân  
- Xem thống kê lượt xem, nhuận bút  

### Admin
- Duyệt / xóa bài viết  
- Quản lý người dùng, thể loại, bình luận  
- Xem báo cáo thống kê  

---

## Cài đặt & chạy frontend

### 1. Yêu cầu hệ thống
- Node.js >= 16  
- npm

### 2. Cài đặt dependencies
```bash
cd frontend
npm install
````

### 3. Chạy ứng dụng

```bash
npm start
```

Ứng dụng sẽ chạy tại: `http://localhost:3306`

Mặc định frontend gọi API từ backend `http://localhost:6969`.
Nếu cần chỉnh sửa, update file `.env` hoặc cấu hình API base URL trong code.

Ví dụ file `.env`:

```env
REACT_APP_API_URL=http://localhost:6969/api
```

---



