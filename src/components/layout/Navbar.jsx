import { Layout, Typography, Space, Button, Input, Dropdown } from 'antd';
import {
  GlobalOutlined,
  SearchOutlined,
  UserOutlined,
  BellOutlined,
  LoginOutlined,
  UserAddOutlined,
  BoldOutlined,
  PullRequestOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { newsAPI } from "../../common/api";
import { AutoComplete } from "antd";

const { Header } = Layout;
const { Title } = Typography;

const NAVBAR_HEIGHT = 64;

const Navbar = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [options, setOptions] = useState([]);

  // lấy danh sách bài báo khi load trang
  useEffect(() => {
    newsAPI.getAllNews().then(res => {
      const newsArray = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];
      setNews(newsArray);
    });
  }, []);

  // hàm xử lý gõ vào search
  const handleSearch = (value) => {
    if (!value) {
      setOptions([]);
      return;
    }
    const filtered = news
      .filter(item =>
        item.title.toLowerCase().includes(value.toLowerCase())
      )
      .map(item => ({
        value: item.id,   // id để navigate
        label: item.title // hiện ra gợi ý
      }));

    setOptions(filtered);
  };

  // khi chọn 1 gợi ý
  const onSelect = (id) => {
    navigate(`/news/${id}`);
  };

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
      key: 'create',
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
      key: 'request-author',
      label: (
        <span className="user-menu-item">
          <PullRequestOutlined className="user-menu-icon" />
          Yêu cầu làm tác giả
        </span>
      ),
      onClick: () => navigate('/request-author'),
    },
    {
      key: 'logout',
      label: (
        <span className="user-menu-item">
          <LogoutOutlined className="user-menu-icon" />
          Đăng xuất
        </span>
      ),
      onClick: () => {
        localStorage.clear();
        navigate('/login');
      }
    }
  ];

  return (
    <Header
      style={{
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
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/home" style={{ textDecoration: 'none' }}>
            <Title level={3} style={{ margin: 0, color: '#1890ff', cursor: 'pointer' }}>
              <GlobalOutlined /> NewsHub
            </Title>
          </Link>
        </div>

        {/* AutoComplete Search */}
        <AutoComplete
          style={{ width: 300 }}
          options={options}
          onSearch={handleSearch}
          onSelect={onSelect}
          placeholder="Tìm kiếm tin tức..."
        >
          <Input suffix={<SearchOutlined />} />
        </AutoComplete>

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
export const NAVBAR_HEIGHT_PX = 20;
