import { Layout, Typography, Space, Button, Input, Dropdown, Menu } from 'antd';
import {
  GlobalOutlined,
  SearchOutlined,
  UserOutlined,
  BellOutlined,
  LoginOutlined,
  UserAddOutlined,
  BookOutlined,
  BoldOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';

const { Header } = Layout;
const { Title } = Typography;
const { Search } = Input;

const NAVBAR_HEIGHT = 64;

const Navbar = () => {
  const navigate = useNavigate();
  const userMenuItems = [
  {
    key: 'info',
    label: (
      <span className="user-menu-item">
        <UserOutlined className="user-menu-icon" />
        Thông tin người dùng
      </span>
    ),
    onClick: () => navigate('/userprofile'),
  },
  {
    key: 'info',
    label: (
      <span className="user-menu-item">
        <BoldOutlined className="user-menu-icon" />
        Đăng bài
      </span>
    ),
    onClick: () => navigate('/createnews'),
  },
  {
    key: 'login',
    label: (
      <span className="user-menu-item">
        <LoginOutlined className="user-menu-icon" />
        Đăng nhập
      </span>
    ),
    onClick: () => navigate('/login'),
  },
  {
    key: 'register',
    label: (
      <span className="user-menu-item">
        <UserAddOutlined className="user-menu-icon" />
        Đăng ký
      </span>
    ),
    onClick: () => navigate('/signup'),
  },
  {
    key: 'logout',
    label: (
      <span className="user-menu-item">
        <LoginOutlined className="user-menu-icon" />
        Đăng xuất
      </span>
    ),
    onClick: () => {
      localStorage.clear();
      navigate('/login')
    }
  }
];



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
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            trigger={['click']}
            overlayStyle={{
              borderRadius: 8,
            
              padding: 8,
            }}
          >
            <Button
              type="text"
              icon={<UserOutlined />}
              style={{
                padding: '0 12px',
                height: 40,
              }}
            />
          </Dropdown>

        </Space>

      </div>
    </Header>
  );
};

export default Navbar;
export const NAVBAR_HEIGHT_PX = 64;