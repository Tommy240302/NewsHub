import { useEffect, useState } from 'react';
import { Menu, Spin, Button, Drawer, Dropdown } from 'antd';
import { Link } from 'react-router-dom';
import { DownOutlined, MenuOutlined } from '@ant-design/icons';
import { categoryAPI } from '../../common/api';
import './Sidebar.css';

const Sidebar = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

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
        background: '#F8F8F8',
        borderBottom: '2px solid #D3DAD9',
        top: 64,
        position: 'fixed',
        width: '100%',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          padding: '0 120px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {loading ? (
          <div style={{ padding: 0}}>
            <Spin size="small" /> Đang tải...
          </div>
        ) : (
          <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
            <Menu
              mode="horizontal"
              style={{
                borderBottom: 'none',
                display: 'flex',
                alignItems: 'center',
                background: 'transparent',
                fontSize: 14,
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              {categories.length > 0 ? (
                categories.map((cat) =>
                  cat.children && cat.children.length > 0 ? (
                    <Menu.SubMenu
                      key={cat.id}
                      title={
                        <span>
                          {cat.content}{' '}
                          <div style={{ fontSize: 10, marginLeft: 4 }} />
                        </span>
                      }
                      onTitleClick={() => navigate(`/chuyen-muc/${cat.id}`)}
                    >
                      <Menu.Item key={`${cat.id}-all`}>
                        <Link
                          to={`/chuyen-muc/${cat.id}`}
                          style={{
                            fontWeight: 'bold',
                            fontSize: '15px',
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
          </div>
        )}

        {/* Dropdown Menu */}
        <Dropdown
          overlayStyle={{ width: '1000px', }}
          placement="bottomRight"
          dropdownRender={() => (
            <div
              style={{
                background: '#EEEEEE',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                borderRadius: 8,
                padding: 20,
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)', // 5 cột
                gap: 16,
                maxHeight: 400,
                overflowY: 'auto',
              }}
            >
              {loading ? (
                <Spin />
              ) : (
                categories.map((cat) => (
                  <div key={cat.id} style={{ marginBottom: 12 }}>
                    <Link
                      to={`/chuyen-muc/${cat.id}`}
                      style={{
                        fontWeight: 'bold',
                        color: '#1890ff',
                        display: 'block',
                        marginBottom: 4,
                      }}
                    >
                      {cat.content}
                    </Link>

                    {cat.children && cat.children.length > 0 && (
                      <div>
                        {cat.children.map((sub) => (
                          <div key={sub.id} style={{ marginBottom: 4 }}>
                            <Link
                              to={`/chuyen-muc/${sub.id}`}
                              style={{
                                color: '#222',
                                textDecoration: 'none',
                                fontStyle: 'italic',
                              }}
                            >
                              {sub.content}
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
          trigger={['click']}
        >
          <Button
            icon={<MenuOutlined />}
            type="text"
            style={{
              fontSize: 20,
            }}
          />
        </Dropdown>

      </div>
    </div>
  );
};

export default Sidebar;
