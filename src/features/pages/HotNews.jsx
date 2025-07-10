

import React from 'react';
import './HotNews.css';

const hotNewsList = [
  {
    id: 1,
    title: 'Cháy lớn tại khu công nghiệp ở Hà Nội',
    imageUrl: 'https://via.placeholder.com/300x180',
    category: 'VĂN HÓA',
    time: '1 phút',
    related: '3 liên quan',
  },
  {
    id: 2,
    title: 'Nóng: Giá xăng tăng mạnh lần thứ ba liên tiếp',
    imageUrl: 'https://via.placeholder.com/300x180',
    category: 'TÀI CHÍNH',
    time: '1 phút',
    related: '3 liên quan',
  },
  {
    id: 3,
    title: 'Bão số 2 sắp đổ bộ vào miền Trung',
    imageUrl: 'https://via.placeholder.com/300x180',
    category: 'THỜI TIẾT',
    time: '1 phút',
    related: '3 liên quan',
  },
];

const HotNews = () => {
  return (
    <div className="hot-news-wrapper">
      <div className="hot-news-container">
        <h2 className="hot-news-title">TIN NÓNG</h2>
        <div className="hot-news-list">
          {hotNewsList.map((news) => (
            <div className="hot-news-card" key={news.id}>
              <img src="/images/logo.png" className="hot-news-image" />
              <div className="hot-news-content">
                <h3 className="hot-news-heading">{news.title}</h3>
                <div className="hot-news-meta">
                  <span className="hot-news-category">{news.category}</span>
                  <span className="hot-news-time">{news.time}</span>
                  <span className="hot-news-related">{news.related}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="hot-news-container2">
        <h2 className="hot-news-title">TIN LIÊN QUAN</h2>
        <div className='slide-news'>
          <div className='slide-news-row'>
            <img src="/images/logo.png" className='silde-news-image'/>
            <h3 className='slide-news-title'>Tiêu đề</h3>
          </div>
          <div className='slide-news-row'>
            <img src="/images/logo.png" className='silde-news-image'/>
            <h3 className='slide-news-title'>Tiêu đề</h3>
          </div>
          <div className='slide-news-row'>
            <img src="/images/logo.png" className='silde-news-image'/>
            <h3 className='slide-news-title'>Tiêu đề</h3>
          </div>
          
        </div>
      </div>
    </div>

  );
};

export default HotNews;
