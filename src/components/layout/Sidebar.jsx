import { useEffect, useState } from 'react';
import { Menu, Spin } from 'antd';
import { Link } from 'react-router-dom';
import { HomeOutlined, FireOutlined, StarOutlined } from '@ant-design/icons';
import { categoryAPI } from '../../common/api';

const Sidebar = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await categoryAPI.getAllCategories();
        if (res.status === 'Success' && Array.isArray(res.data)) {
          const activeCategories = res.data.filter((c) => !c.isDeleted);
          setCategories(activeCategories);
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
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
        padding: '0 40px',
      }}
    >
      <Menu
        mode="horizontal"
        defaultSelectedKeys={['home']}
        style={{
          borderBottom: 'none',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        <Menu.Item key="home" icon={<HomeOutlined />}>
          <Link to="/home">Trang chủ</Link>
        </Menu.Item>

        <Menu.Item key="hot" icon={<FireOutlined />}>
          <Link to="/hotnews">Tin mới nhất</Link>
        </Menu.Item>

        <Menu.Item key="featured" icon={<StarOutlined />}>
          <Link to="/trendnews">Tin nổi bật</Link>
        </Menu.Item>

        {loading ? (
          <Menu.Item key="loading" disabled>
            <Spin size="small" /> Đang tải...
          </Menu.Item>
        ) : categories.length > 0 ? (
          categories.map((cat) => (
            <Menu.Item key={cat.id}>
              <Link to={`/chuyen-muc/${cat.id}`}>{cat.content}</Link>
            </Menu.Item>
          ))
        ) : (
          <Menu.Item key="no-category" disabled>
            Không có chuyên mục
          </Menu.Item>
        )}
      </Menu>
    </div>
  );
};

export default Sidebar;
