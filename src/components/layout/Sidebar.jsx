import { useEffect, useState } from 'react';
import { Menu, Spin } from 'antd';
import { Link } from 'react-router-dom';
import {
  HomeOutlined,
  FireOutlined,
  StarOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { categoryAPI } from '../../common/api';

const Sidebar = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await categoryAPI.getAllCategories();
        console.log('Categories API result:', res);

        if (res.status === 'Success' && Array.isArray(res.data)) {
          setCategories(res.data);
        } else {
          console.error('Lỗi lấy category:', res.errorMessage || res.message);
        }
      } catch (err) {
        console.error('Lỗi gọi API categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 64,
        left: 0,
        height: `calc(100vh - 64px)`,
        width: 200,
        background: '#fff',
        borderRight: '1px solid #f0f0f0',
        overflowY: 'auto',
        zIndex: 100,
      }}
    >
      <Menu
        mode="inline"
        defaultSelectedKeys={['home']}
        defaultOpenKeys={['topics']}
        style={{ height: '100%', borderRight: 0 }}
      >
        <Menu.Item key="home" icon={<HomeOutlined />}>
          <Link to="/home">Trang chủ</Link>
        </Menu.Item>

        <Menu.Item key="hot" icon={<FireOutlined />}>
          <Link to="/hotnews">Tin nóng</Link>
        </Menu.Item>

        <Menu.Item key="featured" icon={<StarOutlined />}>
          <Link to="/trendnews">Tin nổi bật</Link>
        </Menu.Item>

        <Menu.SubMenu key="topics" icon={<MenuOutlined />} title="Chuyên mục">
          {loading ? (
            <Menu.Item key="loading" disabled>
              <Spin size="small" /> Đang tải...
            </Menu.Item>
          ) : categories.length > 0 ? (
            categories.map((cat) => (
              <Menu.Item key={cat.id}>
                {/* Dùng trực tiếp id thay vì slug */}
                <Link to={`/chuyen-muc/${cat.id}`}>
                  {cat.content}
                </Link>
              </Menu.Item>
            ))
          ) : (
            <Menu.Item key="no-category" disabled>
              Không có chuyên mục
            </Menu.Item>
          )}
        </Menu.SubMenu>
      </Menu>
    </div>
  );
};

export default Sidebar;
