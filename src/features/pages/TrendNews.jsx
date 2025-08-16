
import React, { useEffect, useState } from 'react';
import { newsAPI } from '../../common/api';
import { Card, List, Typography, Badge, Spin } from 'antd';
import './HotNews.css';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

const TrendNews = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await newsAPI.getAllNews();
        let data = [];

        if (Array.isArray(res.data)) {
          data = res.data;
        } else if (res.data && Array.isArray(res.data.data)) {
          data = res.data.data;
        }

        const filteredNews = data.filter(item => !item.isDeleted);

        // Sắp xếp giảm dần theo view
        const sortedData = [...filteredNews].sort((a, b) => {
          const viewsA = Number(a.view) || 0;
          const viewsB = Number(b.view) || 0;
          return viewsB - viewsA; // Lớn hơn trước
        });

        setNewsList(sortedData);
      } catch (err) {
        setNewsList([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <Card
      title={
        <span style={{ fontSize: '24px', color: '#ff4d4f', fontWeight: 'bold' }}>
          Tin nổi bật
        </span>
      }
      style={{ margin: 24 }}>
      {loading ? (
        <div style={{ textAlign: 'center', padding: 32 }}><Spin /></div>
      ) : (
        <List
          dataSource={newsList}
          locale={{ emptyText: 'Không có bài viết nào.' }}
          renderItem={item => (
            <List.Item 
              className="hotnews-list-item"
              onClick={() => navigate(`/news/${item.id}`)}
              style={{ cursor: 'pointer' }}
              >
              <div className="hotnews-card">
                <img
                  src={item.image}
                  alt="news"
                  className="hotnews-img"
                />
                <div className="hotnews-content">
                  <div className="hotnews-title-row">
                    <span className="hotnews-title">{item.title}</span>
                    <Badge count={item.view} className="hotnews-badge" />
                  </div>
                  <div className="hotnews-date">
                    {item.publishedAt ? new Date(item.publishedAt).toLocaleString() : ''}
                  </div>
                  <div>
                    <div className="hotnews-summary">{item.summary}</div>
                  </div>
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

export default TrendNews;
