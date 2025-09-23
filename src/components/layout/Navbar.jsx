import { Layout, Typography, Space, Button, Input, Dropdown, AutoComplete } from 'antd';
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
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { newsAPI } from '../../common/api';

const { Header } = Layout;
const { Title } = Typography;

export const NAVBAR_HEIGHT = 64;

const Navbar = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [options, setOptions] = useState([]);

  // Lấy danh sách bài báo
  useEffect(() => {
    newsAPI.getAllNews().then((res) => {
      const newsArray = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setNews(newsArray);
    });
  }, []);

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

  const userMenuItems = [
    {
      key: 'info',
      label: (
        <span>
          <UserOutlined /> Thông tin người dùng
        </span>
      ),
      onClick: () => navigate('/userprofile'),
    },
    {
      key: 'create',
      label: (
        <span>
          <BoldOutlined /> Đăng bài
        </span>
      ),
      onClick: () => navigate('/createnews'),
    },
    {
      key: 'login',
      label: (
        <span>
          <LoginOutlined /> Đăng nhập
        </span>
      ),
      onClick: () => navigate('/login'),
    },
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
      key: 'request-author',
      label: (
        <span>
          <PullRequestOutlined /> Yêu cầu làm tác giả
        </span>
      ),
      onClick: () => navigate('/request-author'),
    },
    {
      key: 'logout',
      label: (
        <span>
          <LogoutOutlined /> Đăng xuất
        </span>
      ),
      onClick: () => {
        localStorage.clear();
        navigate('/login');
      },
    },
  ];

  return (
    <Header
      style={{
        background: '#fff',
        padding: '0 24px',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1100,
        height: NAVBAR_HEIGHT,
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        {/* Logo */}
        <Link to="/home" style={{ textDecoration: 'none' }}>
          <Title level={3} style={{ margin: 0, color: '#1890ff', cursor: 'pointer' }}>
            <GlobalOutlined /> NewsHub
          </Title>
        </Link>

        {/* Search */}
        <AutoComplete
          style={{ width: 400 }}
          options={options}
          onSearch={handleSearch}
          onSelect={onSelect}
          placeholder="Tìm kiếm tin tức..."
        >
          <Input suffix={<SearchOutlined />} />
        </AutoComplete>

        {/* Icons */}
        <Space>
          <Button type="text" icon={<BellOutlined />} />
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
            <Button type="text" icon={<UserOutlined />} />
          </Dropdown>
        </Space>
      </div>
    </Header>
  );
};

export default Navbar;
