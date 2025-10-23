import { Layout, Typography, Space, Button, Input, Dropdown, AutoComplete, Menu } from 'antd';
import {
  GlobalOutlined,
  SearchOutlined,
  UserOutlined,
  BellOutlined,
  LoginOutlined,
  UserAddOutlined,
  BoldOutlined,
  PullRequestOutlined,
  LogoutOutlined,
  StarOutlined,
  FireOutlined,
  HomeOutlined,
  JavaScriptOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { newsAPI } from '../../common/api';
import { set } from 'lodash';
import './Navbar.css';
import { jwtDecode } from 'jwt-decode';
import { useMemo } from 'react'; 
import { colors } from '@mui/material';

const { Header } = Layout;
const { Title } = Typography;

export const NAVBAR_HEIGHT = 64;

const Navbar = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [options, setOptions] = useState([]);
  const [dateTime, setDateTime] = useState(new Date());
  const [roles, setRoles] = useState([]);
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log('Decoded token:', decoded);
        setRoles(decoded.roles || []);
        console.log('User roles:', decoded.roles);
      } catch (error) {
        console.error('Lỗi giải mã token:', error);
      } 
    }
  }, []);

  // Lấy danh sách bài báo
  useEffect(() => {
    newsAPI.getAllNews().then((res) => {
      const newsArray = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setNews(newsArray);
    });
  }, []);
  const interval = setInterval(() => {
    setDateTime(new Date());
  }, 60000);
  // Xử lý tìm kiếm
  const handleSearch = (value) => {
    if (!value) {
      setOptions([]);
      return;
    }
    const filtered = news
      .filter((item) => item.title.toLowerCase().includes(value.toLowerCase()))
      .map((item) => ({
        value: item.id,
        label: item.title,
      }));

    setOptions(filtered);
  };

  // Khi chọn 1 gợi ý
  const onSelect = (id) => {
    navigate(`/news/${id}`);
  };

  // Menu người dùng
 const userMenuItems = useMemo(() => {
  console.log("Rendering menu, roles:", roles); // xem roles mỗi lần render

  const items = [
    {
      key: 'info',
      label: (
        <span>
          <UserOutlined /> Thông tin người dùng
        </span>
      ),
      onClick: () => navigate('/userprofile'),
    },
  ];

  // Chỉ thêm khi có role AUTHOR
  if (Array.isArray(roles) && roles.includes('ROLE_AUTHOR')) {
    items.push({
      key: 'create',
      label: (
        <span>
          <BoldOutlined /> Đăng bài
        </span>
      ),
      onClick: () => navigate('/createnews'),
    });
  }
  // CHỉ thêm khi không có role AUTHOR
  if (isLoggedIn && Array.isArray(roles) && !roles.includes('ROLE_AUTHOR')) {
    items.push({
      key: 'request',
      label: (  
        <span>
          <PullRequestOutlined /> Yêu cầu tác giả
        </span>
      ),
      onClick: () => navigate('/request-author'),
    });
  }

  if (!isLoggedIn) {
    items.push(
      {
        key: 'login',
        label: (
          <span>
            <LoginOutlined /> Đăng nhập
          </span>
        ),
        onClick: () => navigate('/login'),
      }
    );
  }
  items.push(
    {
      key: 'register',
      label: (
        <span>
          <UserAddOutlined /> Đăng ký
        </span>
      ),
      onClick: () => navigate('/signup'),
    },
    
    {
      type: 'divider',
    },
  );
  if (isLoggedIn) {
    items.push({
      key: 'logout',
      label: (
        <span style={{color: '#DB4437', fontWeight: '500', fontSize: '16px', fontStyle: 'bold'}}>
          <LogoutOutlined /> Đăng xuất
        </span>
      ),
      onClick: () => {
        localStorage.removeItem('token');
        navigate('/home');
        window.location.reload(); // reload lại trang để cập nhật trạng thái đăng nhập
      }
    });
  }

  return items;
}, [roles]);

  return (
    <Header
      style={{
        background: '#1B3C53',
        padding: '0 120px',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1100,
        height: NAVBAR_HEIGHT,
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderBottom: '1px solid #1B3C53',
      }}
    >
      {/* Logo */}
      <Link to="/home" style={{ textDecoration: 'none', marginRight: 32 }}>
        <Title level={3} style={{ margin: 0, color: '#fff', cursor: 'pointer' }}>
          <JavaScriptOutlined /> NewsHub
        </Title>
      </Link>

      {/* Menu chính */}
      <Menu
        mode="horizontal"
        selectable={false}
        style={{
          flex: 1,
          borderBottom: 'none',
          fontSize: 15,
          justifyContent: 'center',
          background: 'transparent',
        }}
      >

        <div style={{ fontSize: 14, color: '#fff', minWidth: '200px', textAlign: 'right' }}>
          <div>
            {dateTime.toLocaleDateString('vi-VN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>

        <Menu.Item style={
          { color: '#fff' }
        } key="hot" icon={<FireOutlined />}>
          <Link to="/hotnews">Tin mới nhất</Link>
        </Menu.Item>
        <Menu.Item style={
          { color: '#fff' }
        } key="featured" icon={<StarOutlined />}>
          <Link to="/trendnews">Tin nổi bật</Link>
        </Menu.Item>
      </Menu>

      {/* Search + Icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <AutoComplete
          style={{ width: 280 }}
          options={options}
          onSearch={handleSearch}
          onSelect={onSelect}
          placeholder="Tìm kiếm tin tức..."
        >
          <Input suffix={<SearchOutlined />} />
        </AutoComplete>

        <Space>
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            trigger={['click']}
            overlayClassName="custom-dropdown"
          >
            <Button
              type="text"
              icon={isLoggedIn ? <UserOutlined /> : <DownOutlined />}
              style={{
                color: '#fff',
                fontSize: '18px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.1)',
                width: '40px',
                height: '40px',
              }}
            />
          </Dropdown>

        </Space>

      </div>
    </Header>
  );
};

export default Navbar;
