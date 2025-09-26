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
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { newsAPI } from '../../common/api';
import { set } from 'lodash';

const { Header } = Layout;
const { Title } = Typography;

export const NAVBAR_HEIGHT = 64;

const Navbar = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [options, setOptions] = useState([]);
  const [dateTime, setDateTime] = useState(new Date());

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
        background: '#4A102A',
        padding: '0 170px',
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
          <Button style={
            { color: '#fff' }
          } type="text" icon={<BellOutlined />} />
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
            <Button style={
              { color: '#fff' }
            } type="text" icon={<UserOutlined />} />
          </Dropdown>
        </Space>
      </div>
    </Header>
  );
};

export default Navbar;
