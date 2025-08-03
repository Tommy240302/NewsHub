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

const HomePage2 = () => {
  const [featuredNews, setFeaturedNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const trendingNews = featuredNews.slice(0, 4).map(item => ({
    id: item.id,
    title: item.title,
    time: new Date(item.publishedAt).toLocaleTimeString(),
    views: item.view ? `${(item.view / 1000).toFixed(1)}K` : '1.2K'
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
        setFeaturedNews(newsArray);
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
                <div className="carousel-slide" style={{ backgroundImage: `url(${news.image})` }}>
                  <div style={{ color: 'white' }}>
                    <Tag color={news.hot ? 'red' : 'blue'} style={{ marginBottom: 8 }}>
                      {news.hot ? <FireOutlined /> : <StarOutlined />} {news.category}
                    </Tag>
                    <Title level={2} style={{ color: 'white', marginBottom: 8 }}>
                      {news.title}
                    </Title>
                    <Paragraph style={{ color: 'white', fontSize: 16, marginBottom: 16 }}>
                      {news.summary}
                    </Paragraph>
                    <Text style={{ color: 'rgba(255,255,255,0.8)' }}>
                      {news.publishedAt ? new Date(news.publishedAt).toLocaleString() : news.time}
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
                    <NewsCard news={news} />
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

export default HomePage2;
