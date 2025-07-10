// src/pages/TrendNews.jsx

import React from 'react';
import './TrendNews.css';

const trendingNews = [
  {
    id: 1,
    title: 'TikTok ra mắt tính năng AI mới thu hút hàng triệu người dùng',
    imageUrl: 'https://via.placeholder.com/300x180',
    tag: '#Công nghệ',
  },
  {
    id: 2,
    title: 'Sơn Tùng M-TP comeback sau 1 năm vắng bóng',
    imageUrl: 'https://via.placeholder.com/300x180',
    tag: '#Giải trí',
  },
  {
    id: 3,
    title: 'Việt Nam vào top 10 điểm đến hấp dẫn nhất 2025',
    imageUrl: 'https://via.placeholder.com/300x180',
    tag: '#Du lịch',
  },
];

const TrendNews = () => {
  return (
    <div className="trend-news-container">
      <h2 className="trend-news-title">Tin Xu Hướng</h2>
      <div className="trend-news-list">
        {trendingNews.map((item) => (
          <div className="trend-news-card" key={item.id}>
            <img src={item.imageUrl} alt={item.title} className="trend-news-image" />
            <div className="trend-news-info">
              <span className="trend-news-tag">{item.tag}</span>
              <h3 className="trend-news-heading">{item.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendNews;
