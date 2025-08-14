import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // jwt-decode v4.x dùng named import

const ProtectedRoute = () => {
  const token = localStorage.getItem("jwtToken");

  // Không có token → chuyển hướng login
  if (!token) {
    console.warn("ProtectedRoute: Không tìm thấy token, chuyển hướng /admin/login");
    return <Navigate to="/admin/login" replace />;
  }

  try {
    const decodedToken = jwtDecode(token);
    console.log("ProtectedRoute: Token giải mã:", decodedToken);

    // Kiểm tra hết hạn (exp tính theo giây → *1000 để ra ms)
    if (!decodedToken.exp || decodedToken.exp * 1000 < Date.now()) {
      console.warn("ProtectedRoute: Token hết hạn, xóa token và chuyển hướng /admin/login");
      localStorage.removeItem("jwtToken");
      return <Navigate to="/admin/login" replace />;
    }

    // Kiểm tra quyền
    const roles = decodedToken.roles || [];
    if (!roles.includes("ROLE_ADMIN")) {
      console.warn("ProtectedRoute: Không có quyền ADMIN, chuyển hướng /forbidden");
      return <Navigate to="/forbidden" replace />;
    }

    // Nếu mọi thứ ok
    return <Outlet />;
  } catch (error) {
    console.error("ProtectedRoute: Lỗi giải mã token:", error);
    localStorage.removeItem("jwtToken");
    return <Navigate to="/admin/login" replace />;
  }
};

export default ProtectedRoute;
