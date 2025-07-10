import React from 'react';
import { Routes, Route } from 'react-router-dom';

import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';

import HomePage from './features/home/HomePage';
import AboutPage from './features/about/AboutPage';
import ContactPage from './features/contact/ContactPage';

import Login from './features/auth/Login';
import SignUp from './features/auth/SignUp';

import AdminLoginPage from './features/admin/loginAdmin/AdminLoginPage';
import DashboardAdmin from './features/admin/dashboardAdmin/DashboardAdmin';
import PostsAD from './features/admin/postsAdmin/PostsAD';
import UsersAD from './features/admin/usersAdmin/UsersAD';
import StatisticsAD from './features/admin/statisticsAdmin/StatisticsAD'; 

import ProtectedRoute from './utils/ProtectedRoute';

import './App.css';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
        </Route>

        <Route path="/admin/login" element={<AdminLoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardAdmin />} />
            <Route path="dashboard" element={<DashboardAdmin />} />
            <Route path="posts" element={<PostsAD />} />
            <Route path="users" element={<UsersAD />} />
            <Route path="statistics" element={<StatisticsAD />} /> 
          </Route>
        </Route>

        <Route path="*" element={
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>404 - Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <a href="/">Go to Home</a>
          </div>
        } />
      </Routes>
    </>
  );
}
export default App; 