import { Layout, Typography, Space, Button, Input } from 'antd';
import {
  GlobalOutlined,
  SearchOutlined,
  UserOutlined,
  BellOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Header } = Layout;
const { Title } = Typography;
const { Search } = Input;

const NAVBAR_HEIGHT = 64;

const Navbar = () => {
  return (
    <Header style={{
      background: '#fff',
      padding: '0 24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 1100,
      height: NAVBAR_HEIGHT,
      display: 'flex',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/home" style={{ textDecoration: 'none' }}>
            <Title level={3} style={{ margin: 0, color: '#1890ff', cursor: 'pointer' }}>
              <GlobalOutlined /> NewsHub
            </Title>
          </Link>
        </div>

        <Search
          placeholder="Tìm kiếm tin tức..."
          style={{ width: 300 }}
          enterButton={<SearchOutlined />}
        />

        <Space>
          <Button type="text" icon={<BellOutlined />} />
          <Link to={"/login"}>
            <Button type="text" icon={<UserOutlined />} />
          </Link>
        </Space>
      </div>
    </Header>
  );
};

export default Navbar;
export const NAVBAR_HEIGHT_PX = 64;