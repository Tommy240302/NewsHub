import { Carousel, Typography, Tag, Row, Col, Spin, Divider } from 'antd';
import { FireOutlined, StarOutlined } from '@ant-design/icons';
import NewsCard from '../../components/ui/NewsCard';
import TrendingNews from '../../components/ui/TrendingNews';
import WeatherWidget from '../../components/ui/WeatherWidget';
import { NAVBAR_HEIGHT } from '../../components/layout/Navbar';
import { useEffect, useState } from 'react';
import { newsAPI } from '../../common/api';
import './HomePage2.css';

const { Title, Text, Paragraph } = Typography;

const safeText = (val) => (typeof val === 'string' ? val : '');
const safeNumber = (val) => (typeof val === 'number' ? val : 0);

const HomePage = () => {
  const [featuredNews, setFeaturedNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const trendingNews = featuredNews.slice(0, 5).map(item => ({
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

        const filteredNews = newsArray.filter(item =>
          (item.isDeleted === false || item.isDeleted === 0) &&
          (item.status === true || item.status === 1)
        );

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
    <div style={{ paddingTop: NAVBAR_HEIGHT, background: '#f8f9fa', minHeight: '100vh' }}>
      {loading ? (
        <div className="homepage2-loading">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* Banner Carousel */}
          <Carousel autoplay dotPosition="bottom" effect="fade" style={{ marginBottom: 24 }}>
            {featuredNews.slice(0, 5).map(news => (
              <div key={news.id}>
                <div
                  className="carousel-slide"
                  style={{
                    backgroundImage: `url(${safeText(news.image)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: 420,
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: 32,
                  }}
                >
                  <div style={{ color: 'white', maxWidth: '60%' }}>
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
                      {news.publishedAt ? new Date(news.publishedAt).toLocaleString() : ''}
                    </Text>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>

          {/* Main Layout */}
          <Row gutter={24} style={{ maxWidth: 1200, margin: '0 auto' }}>
            {/* Left Column */}
            <Col xs={24} lg={16}>
              <Title level={3} style={{ marginBottom: 16 }}>
                <FireOutlined style={{ color: '#ff4d4f' }} /> Tin tức mới nhất
              </Title>
              <Row gutter={[16, 16]}>
                {featuredNews.slice(0, 12).map(news => (
                  <Col xs={24} md={12} key={news.id}>
                    <NewsCard
                      news={{
                        ...news,
                        title: safeText(news.title),
                        summary: safeText(news.summary),
                        category: safeText(news.category),
                      }}
                    />
                  </Col>
                ))}
              </Row>

              <Divider style={{ margin: '32px 0' }} />

              <Title level={3} style={{ marginBottom: 16 }}>
                <StarOutlined style={{ color: '#faad14' }} /> Tin nổi bật
              </Title>
              <Row gutter={[16, 16]}>
                {featuredNews.slice(12, 20).map(news => (
                  <Col xs={24} md={12} key={news.id}>
                    <NewsCard
                      news={{
                        ...news,
                        title: safeText(news.title),
                        summary: safeText(news.summary),
                        category: safeText(news.category),
                      }}
                    />
                  </Col>
                ))}
              </Row>
            </Col>

            {/* Right Column */}
            <Col xs={24} lg={8}>
              <div style={{ position: 'sticky', top: 80 }}>
                <TrendingNews trendingNews={trendingNews} />
                <Divider />
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
