import React from "react";
import { Routes, Route } from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";
import AdminLayout from "./components/layout/AdminLayout";

import HomePage from "./features/home/HomePage";
import AboutPage from "./features/about/AboutPage";
import ContactPage from "./features/contact/ContactPage";
import HomePage2 from "./features/home/HomePage2";
import RequestAuthor from "./features/user/RequestAuthor";
import NewsDetailPage from "./features/news/NewsDetail";
import CategoryPage from "./features/pages/CategoryPage";

import Login from "./features/auth/Login";
import SignUp from "./features/auth/SignUp";
import HotNews from "./features/pages/HotNews";
import TrendNews from "./features/pages/TrendNews";
import UserProfile from "./features/auth/UserProfile";
import UserProfile2 from "./features/auth/UserProfile2";
import SaveNews from "./features/pages/SaveNews";
import CategoryList from "./features/author/CategoryList";
import ListNews from "./components/ui/ListNews";

import AdminLoginPage from "./features/admin/loginAdmin/AdminLoginPage";
import CategoriesAD from './features/admin/categoryAdmin/CategoriesAD';
import DashboardAdmin from "./features/admin/dashboardAdmin/DashboardAdmin";
import PostsAD from "./features/admin/postsAdmin/PostsAD";
import UsersAD from "./features/admin/usersAdmin/UsersAD";
import AuthorRequestsManagement from "./features/admin/authorRequestsAdmin/AuthorRequestsManagement";
import StatisticsAD from "./features/admin/statisticsAdmin/StatisticsAD";
import RoyaltyPayment from "./features/admin/PaymentsAdmin/RoyaltyPayment";
import CreateNews from "./features/author/CreateNews";
import ProtectedRoute from "./utils/ProtectedRoute";

import "./App.css";

function App() {
  return (
    <Routes>
      {/* Public User Layout */}
      <Route path="/" element={<MainLayout />}>
        <Route path="home" element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="hotnews" element={<HotNews />} />
        <Route path="trendnews" element={<TrendNews />} />
        
        {/* Kết hợp các route từ cả hai nhánh */}
        <Route path="chuyen-muc/:id" element={<CategoryPage />} />
        <Route path="request-author" element={<RequestAuthor />} />
        <Route path="news/:id" element={<NewsDetailPage />} />
        <Route path="userprofile" element={<UserProfile />} />
        <Route path="savenews" element={<SaveNews />} />
        <Route path="userprofile2" element={<UserProfile2 />} />
        <Route path="category" element={<CategoryList />} />
        <Route path="listnews" element={<ListNews />} />
        <Route path="home2" element={<HomePage2 />} />
      </Route>
      
      {/* Trang không dùng layout */}
      <Route path="/createnews" element={<CreateNews />} />

      {/* Admin Login */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardAdmin />} />
          <Route path="dashboard" element={<DashboardAdmin />} />
          <Route path="posts" element={<PostsAD />} />
          <Route path="users" element={<UsersAD />} />
          <Route path="author-requests" element={<AuthorRequestsManagement />} />
          <Route path="categories" element={<CategoriesAD />} />
          <Route path="statistics" element={<StatisticsAD />} />
          <Route path="payments" element={<RoyaltyPayment />} />
        </Route>
      </Route>

      {/* 404 Page */}
      <Route
        path="*"
        element={
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>404 - Không tìm thấy trang</h1>
            <p>Trang bạn đang tìm kiếm không tồn tại.</p>
            <a href="/">Về trang chủ</a>
          </div>
        }
      />
      
      {/* Route forbidden */}
      <Route
        path="/forbidden"
        element={
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>403 - Không có quyền truy cập</h1>
            <p>Bạn không có quyền truy cập vào trang này.</p>
            <a href="/">Về trang chủ</a>
          </div>
        }
      />
    </Routes>
  );
}

export default App;
