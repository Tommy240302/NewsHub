import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { categoryAPI } from '../../common/api';
import { Card, List, Badge, Spin } from 'antd';
import './HotNews.css';

const CategoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    const fetchCategoryName = async () => {
      try {
        const res = await categoryAPI.getAllCategories();
        const categories = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];

        const found = categories.find(c => String(c.id) === String(id));
        if (found) setCategoryName(found.content);
      } catch (err) {
        console.error("Lỗi tải danh sách chuyên mục:", err);
        setCategoryName("");
      }
    };

    if (id) {
      fetchCategoryName();
    }
  }, [id]);

  useEffect(() => {
    const fetchCategoryNews = async () => {
      try {
        setLoading(true);
        const res = await categoryAPI.getNewsByCategory(id);

        const newsArray = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
            ? res.data.data
            : [];

        const filteredNews = newsArray.filter(
          (item) => item.isDeleted === false || item.isDeleted === 0
        );

        const sortedNews = [...filteredNews].sort((a, b) => {
          const timeA = new Date(a.publishedAt).getTime();
          const timeB = new Date(b.publishedAt).getTime();
          return timeB - timeA;
        });

        setNewsList(sortedNews);
      } catch (err) {
        console.error("Lỗi tải tin theo chuyên mục:", err);
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
          Chuyên mục: {categoryName || "Đang tải..."}
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
            <List.Item
              className="hotnews-list-item"
              onClick={() => navigate(`/news/${item.id}`)}
              style={{ cursor: 'pointer' }}
            >
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
