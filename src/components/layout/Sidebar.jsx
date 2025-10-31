import { useEffect, useState } from 'react';
import { Menu, Spin } from 'antd';
import { Link } from 'react-router-dom';
import { DownOutlined } from '@ant-design/icons';
import { categoryAPI } from '../../common/api';
import './Sidebar.css';

const Sidebar = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const buildCategoryTree = (categories) => {
    const map = {};
    const roots = [];

    categories.forEach((cat) => {
      map[cat.id] = { ...cat, children: [] };
    });

    categories.forEach((cat) => {
      if (cat.parentId && map[cat.parentId]) {
        map[cat.parentId].children.push(map[cat.id]);
      } else {
        roots.push(map[cat.id]);
      }
    });

    return roots;
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await categoryAPI.getAllCategories();
        if (res.status === 'Success' && Array.isArray(res.data)) {
          const active = res.data.filter((c) => !c.isDeleted);
          const tree = buildCategoryTree(active);
          setCategories(active);
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
        position: 'fixed',
        width: '100%',
        zIndex: 1000,
      }}
    >
      <div style={{ padding: '0 120px' }}>
        {loading ? (
          <div style={{ padding: 8 }}>
            <Spin size="small" /> Đang tải...
          </div>
        ) : (
          <Menu
            mode="horizontal"
            style={{
              borderBottom: 'none',
              display: 'flex',
              alignItems: 'center',
              background: 'transparent',
              fontSize: 14,
              flexWrap: 'nowrap',
            }}
          >
            {categories.length > 0 ? (
              categories.map((cat) =>
                cat.children && cat.children.length > 0 ? (
                  <Menu.SubMenu
                    key={cat.id}
                    title={
                      <span>
                        {cat.content} <DownOutlined style={{ fontSize: 10, marginLeft: 4 }} />
                      </span>
                    }
                    onTitleClick={() => navigate(`/chuyen-muc/${cat.id}`)}

                  >
                    <Menu.Item key={`${cat.id}-all`}>
                      <Link
                        to={`/chuyen-muc/${cat.id}`}
                        style={{
                          fontWeight: 'bold',
                          fontSize: '16px',
                          color: '#1890ff',
                        }}
                      >
                        {cat.content}
                      </Link>
                    </Menu.Item>

                    {cat.children.map((sub) => (
                      <Menu.Item key={sub.id}>
                        <Link to={`/chuyen-muc/${sub.id}`}>{sub.content}</Link>
                      </Menu.Item>
                    ))}
                  </Menu.SubMenu>

                ) : (
                  <Menu.Item key={cat.id}>
                    <Link to={`/chuyen-muc/${cat.id}`}>{cat.content}</Link>
                  </Menu.Item>
                )
              )
            ) : (
              <Menu.Item key="no-category" disabled>
                Không có chuyên mục
              </Menu.Item>
            )}
          </Menu>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
