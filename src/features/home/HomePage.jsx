import { Carousel, Typography, Tag, Row, Col, Spin } from 'antd';
import { FireOutlined, StarOutlined } from '@ant-design/icons';
import NewsCard from '../../components/ui/NewsCard';
import TrendingNews from '../../components/ui/TrendingNews';
import WeatherWidget from '../../components/ui/WeatherWidget';
import { NAVBAR_HEIGHT_PX } from '../../components/layout/Navbar';
import { useEffect, useState } from 'react';
import { newsAPI } from '../../common/api';
import './HomePage2.css';

const { Title, Text, Paragraph } = Typography;

const safeText = (val) => (typeof val === 'string' ? val : '');
const safeNumber = (val) => (typeof val === 'number' ? val : 0);

const HomePage = () => {
  const [featuredNews, setFeaturedNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const trendingNews = featuredNews.slice(0, 4).map(item => ({
    id: item.id,
    title: safeText(item.title),
    time: item.publishedAt ? new Date(item.publishedAt).toLocaleTimeString() : '',
    views: safeNumber(item.view) ? `${(item.view / 1000).toFixed(1)}K` : '1.2K'
  }));

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await newsAPI.getAllNews();
        const newsArray = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
            ? res.data.data
            : [];

        // Lọc bỏ bài viết đã xóa (is_deleted = 1)
        const filteredNews = newsArray.filter(item => 
          (item.isDeleted === false || item.isDeleted === 0) && 
          (item.status === true || item.status === 1)
        );

        // Sắp xếp theo publishedAt giảm dần (tin mới trước)
        const sortedNews = [...filteredNews].sort((a, b) => {
          const timeA = new Date(a.publishedAt).getTime();
          const timeB = new Date(b.publishedAt).getTime();
          return timeB - timeA;
        });

        setFeaturedNews(sortedNews);
      } catch (err) {
        setFeaturedNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div style={{ paddingTop: NAVBAR_HEIGHT_PX }}>
      {loading ? (
        <div className="homepage2-loading"><Spin size="large" /></div>
      ) : (
        <>
          <Carousel autoplay dotPosition='bottom' effect='fade' style={{ marginBottom: 24 }}>
            {featuredNews.map(news => (
              <div key={news.id}>
                <div className="carousel-slide" style={{ backgroundImage: `url(${safeText(news.image)})` }}>
                  <div style={{ color: 'white' }}>
                    <Tag color={news.hot ? 'red' : 'blue'} style={{ marginBottom: 8 }}>
                      {news.hot ? <FireOutlined /> : <StarOutlined />} {safeText(news.category)}
                    </Tag>
                    <Title level={2} style={{ color: 'white', marginBottom: 8 }}>
                      {safeText(news.title)}
                    </Title>
                    <Paragraph style={{ color: 'white', fontSize: 16, marginBottom: 16 }}>
                      {safeText(news.summary)}
                    </Paragraph>
                    <Text style={{ color: 'rgba(255,255,255,0.8)' }}>
                      {news.publishedAt ? new Date(news.publishedAt).toLocaleString() : safeText(news.time)}
                    </Text>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>

          <Row gutter={24}>
            <Col xs={24} lg={16}>
              <Title level={3} style={{ marginBottom: 16 }}>
                <FireOutlined style={{ color: '#ff4d4f' }} /> Tin tức mới nhất
              </Title>
              <Row gutter={[16, 16]}>
                {featuredNews.map(news => (
                  <Col xs={24} md={12} key={news.id}>
                    <NewsCard news={{
                      ...news,
                      title: safeText(news.title),
                      summary: safeText(news.summary),
                      category: safeText(news.category)
                    }} />
                  </Col>
                ))}
              </Row>
            </Col>

            <Col xs={24} lg={8}>
              <div style={{ position: 'sticky', top: 100 }}>
                <TrendingNews trendingNews={trendingNews} />
                <WeatherWidget />
              </div>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default HomePage;
