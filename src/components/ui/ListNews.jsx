import React, { useEffect, useState } from 'react';
import { newsAPI } from '../../common/api';
import { Card, List, Typography, Badge, Spin } from 'antd';

const { Text } = Typography;

const ListNews = () => {
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
    <Card title="Danh sách bài viết" style={{ margin: 24 }}>
      {loading ? (
        <div style={{ textAlign: 'center', padding: 32 }}><Spin /></div>
      ) : (
        <List
          dataSource={newsList}
          locale={{ emptyText: 'Không có bài viết nào.' }}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong style={{ fontSize: 16 }}>{item.title}</Text>
                    <Badge count={item.view} style={{ backgroundColor: '#52c41a' }} />
                  </div>
                }
                description={
                  <>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      {item.publishedAt ? new Date(item.publishedAt).toLocaleString() : ''}
                    </Text>
                    <div style={{ marginTop: 4 }}>
                      <Text type="secondary">Tóm tắt: {item.summary}</Text>
                    </div>
                    <div style={{ marginTop: 2 }}>
                      <Text type="secondary">Tác giả: {item.authorName}</Text>
                    </div>
                  </>
                }
                avatar={<img src={item.image} alt="news" style={{ width: 64, height: 40, objectFit: 'cover', borderRadius: 4 }} />}
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

export default ListNews;
