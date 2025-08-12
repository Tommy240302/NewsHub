import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode để giải mã token

const ProtectedRoute = () => {
  // Lấy token từ localStorage, sử dụng đúng key 'jwtToken'
  const token = localStorage.getItem('jwtToken');

  // Nếu không có token, chuyển hướng về trang đăng nhập admin
  if (!token) {
    console.log("ProtectedRoute: Không tìm thấy token trong localStorage. Chuyển hướng về /admin/login.");
    return <Navigate to="/admin/login" replace />;
  }

  try {
    // Giải mã token để lấy thông tin (payload)
    const decodedToken = jwtDecode(token);
    console.log("ProtectedRoute: Token đã giải mã:", decodedToken);

    // Kiểm tra thời gian hết hạn của token
    // decodedToken.exp là thời gian hết hạn theo Unix timestamp (giây)
    // Date.now() trả về milliseconds, nên cần chia cho 1000
    if (decodedToken.exp * 1000 < Date.now()) {
      console.log("ProtectedRoute: Token đã hết hạn. Xóa token và chuyển hướng về /admin/login.");
      localStorage.removeItem('jwtToken'); // Xóa token hết hạn
      return <Navigate to="/admin/login" replace />;
    }

    // Kiểm tra vai trò của người dùng
    // Giả định vai trò được lưu trong claim 'roles' dưới dạng mảng các chuỗi (ví dụ: ["ROLE_ADMIN", "ROLE_USER"])
    const userRoles = decodedToken.roles || [];
    const isAdmin = userRoles.includes('ROLE_ADMIN'); // Spring Security thêm tiền tố ROLE_

    if (!isAdmin) {
      console.log("ProtectedRoute: Người dùng không có vai trò ADMIN. Chuyển hướng về /forbidden.");
      // Có thể chuyển hướng đến một trang "Truy cập bị từ chối"
      return <Navigate to="/forbidden" replace />;
    }

    // Nếu token hợp lệ và có vai trò ADMIN, cho phép truy cập
    console.log("ProtectedRoute: Token hợp lệ và người dùng là ADMIN. Cho phép truy cập.");
    return <Outlet />;
  } catch (error) {
    // Xử lý lỗi nếu token không hợp lệ (ví dụ: bị thay đổi, định dạng sai)
    console.error("ProtectedRoute: Lỗi giải mã hoặc xác thực token:", error);
    localStorage.removeItem('jwtToken'); // Xóa token không hợp lệ
    return <Navigate to="/admin/login" replace />;
  }
};

export default ProtectedRoute;
