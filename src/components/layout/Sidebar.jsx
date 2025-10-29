import { useEffect, useState } from 'react';
import { Menu, Spin } from 'antd';
import { Link } from 'react-router-dom';
import { HomeOutlined, FireOutlined, StarOutlined } from '@ant-design/icons';
import { categoryAPI } from '../../common/api';
import './Sidebar.css';

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
        background: '#FBFBFB',
        borderBottom: '1px solid #F2F2F2',
        top: 64,
        right: 0,
        left: 0,
        position: 'fixed',
        zIndex: 1000,
        width: '100%',
      }}
    >
    <div style={{padding: '0 120px', boxSizing: 'border-box', overflow: 'hidden', }}>
      <Menu
        mode="horizontal"
        defaultSelectedKeys={['home']}
        style={{
          borderBottom: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontWeight: '400',
          fontSize: '13px',
          cursor: 'pointer',
          background: 'transparent',
        }}
      >

        {loading ? (
          <Menu.Item key="loading" disabled>
            <Spin size="small" /> Đang tải...
          </Menu.Item>
        ) : categories.length > 0 ? (
          categories.map((cat) => (
            <Menu.Item style={
              { color: '#222831' }
            } key={cat.id}>
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
    </div>
  );
};

export default Sidebar;
