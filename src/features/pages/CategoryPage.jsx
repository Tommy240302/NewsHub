import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { categoryAPI } from '../../common/api';
import { Card, List, Badge, Spin } from 'antd';
import './HotNews.css';

const CategoryPage = () => {
  const { id } = useParams(); // Lấy id từ URL
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryNews = async () => {
      try {
        setLoading(true);
        const res = await categoryAPI.getNewsByCategory(id); // Gọi API với id

        if (res.status === 'Success' && Array.isArray(res.data)) {
          setNewsList(res.data);
        } else if (res.data && Array.isArray(res.data.data)) {
          setNewsList(res.data.data);
        } else {
          setNewsList([]);
        }
      } catch (err) {
        console.error('Lỗi tải tin theo chuyên mục:', err);
        setNewsList([]);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCategoryNews();
    }
  }, [id]);

  return (
    <Card
      title={
        <span style={{ fontSize: '24px', color: '#1890ff', fontWeight: 'bold' }}>
          Chuyên mục ID: {id}
        </span>
      }
      style={{ margin: 24 }}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: 32 }}>
          <Spin />
        </div>
      ) : (
        <List
          dataSource={newsList}
          locale={{ emptyText: 'Không có bài viết nào.' }}
          renderItem={(item) => (
            <List.Item className="hotnews-list-item">
              <div className="hotnews-card">
                <img src={item.image} alt="news" className="hotnews-img" />
                <div className="hotnews-content">
                  <div className="hotnews-title-row">
                    <span className="hotnews-title">{item.title}</span>
                    <Badge count={item.views} className="hotnews-badge" />
                  </div>
                  <div className="hotnews-date">
                    {item.publishedAt
                      ? new Date(item.publishedAt).toLocaleString()
                      : ''}
                  </div>
                  <div className="hotnews-summary">{item.summary}</div>
                  <div>
                    <span className="hotnews-label">{item.authorName}</span>
                  </div>
                </div>
              </div>
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

export default CategoryPage;
