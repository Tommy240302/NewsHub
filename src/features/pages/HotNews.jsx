
import React, { useEffect, useState } from 'react';
import { newsAPI } from '../../common/api';
import { Card, List, Typography, Badge, Spin } from 'antd';
import './HotNews.css';

const { Text } = Typography;

const HotNews = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await newsAPI.getAllNews();
        if (Array.isArray(res.data)) {
          setNewsList(res.data);
        } else if (res.data && Array.isArray(res.data.data)) {
          setNewsList(res.data.data);
        } else {
          setNewsList([]);
        }
      } catch (err) {
        setNewsList([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  useEffect(() => {
    console.log('newsList:', newsList);
  }, [newsList]);

  return (
    <Card
      title={
        <span style={{ fontSize: '24px', color: '#ff4d4f', fontWeight: 'bold' }}>
          Tin nóng
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
            <List.Item className="hotnews-list-item">
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

export default HotNews;
