import { Layout } from 'antd';
import Navbar, { NAVBAR_HEIGHT } from './Navbar';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const { Content } = Layout;

const MainLayout = () => {
  return (
    <>
      {/* Navbar trên cùng */}
      <Navbar />

      <Layout
        style={{
          paddingTop: NAVBAR_HEIGHT, // đẩy nội dung xuống dưới navbar
          minHeight: '100vh',
          background: '#f5f5f5',
        }}
      >
        {/* Sidebar ngang ngay dưới Navbar */}
        <Sidebar />

        {/* Nội dung chính */}
        <Content
          style={{
            margin: '16px auto',
            padding: 24,
            minHeight: 280,
            maxWidth: 1200,
            background: '#fff',
            borderRadius: 8,
            boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </>
  );
};

export default MainLayout;
