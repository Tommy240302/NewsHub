import { Layout } from 'antd';
import Navbar, { NAVBAR_HEIGHT_PX } from './Navbar';
import Sidebar from './Sidebar';

const { Content, Sider } = Layout;

const MainLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <Layout style={{ paddingTop: NAVBAR_HEIGHT_PX, minHeight: '100vh' }}>
        <Sider
          width={200}
          style={{
            background: '#fff',
            position: 'fixed',
            top: NAVBAR_HEIGHT_PX,
            left: 0,
            bottom: 0,
            overflow: 'auto',
          }}
        >
          <Sidebar />
        </Sider>

        <Layout style={{ marginLeft: 200, padding: '24px' }}>
          <Content
            style={{
              background: '#fff',
              padding: 24,
              minHeight: 280,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default MainLayout;
