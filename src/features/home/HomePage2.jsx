import React, { useEffect, useState } from "react";
import { Row, Col, Card, Typography, Spin } from "antd";
import { newsAPI } from "../../common/api";

const { Title, Text, Paragraph } = Typography;

const safeText = (val) => (typeof val === "string" ? val : "");
const safeNumber = (val) => (typeof val === "number" ? val : 0);

const HomePage2 = () => {
  const [featuredNews, setFeaturedNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await newsAPI.getAllNews();
        const newsArray = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];

        const filteredNews = newsArray.filter(
          (item) =>
            (item.isDeleted === false || item.isDeleted === 0) &&
            (item.status === true || item.status === 1)
        );

        const sortedNews = [...filteredNews].sort(
          (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
        );

        setFeaturedNews(sortedNews);
      } catch (err) {
        console.error(err);
        setFeaturedNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  const mainNews = featuredNews[0];
  const sideNews = featuredNews.slice(1, 4);
  const trendingNews = featuredNews.slice(4, 100); 

  return (
    <div style={{ padding: "24px" }}>
      {/* Tin nổi bật + 3 tin nhỏ */}
      <Row gutter={[16, 16]}>
        <Col xs={16} lg={16}>
          {mainNews && (
            <Card
              hoverable
              cover={
                <img
                  alt={safeText(mainNews.title)}
                  src={safeText(mainNews.image) || "/path/to/default.jpg"}
                  style={{ width: "100%", maxHeight: 400, objectFit: "cover" }}
                />
              }
            >
              <Text type="secondary">{safeText(mainNews.category)}</Text>
              <Title level={4}>{safeText(mainNews.title)}</Title>
              <Paragraph>{safeText(mainNews.summary)}</Paragraph>
            </Card>
          )}
        </Col>

        <Col xs={24} lg={8}>
          <Row gutter={[16, 16]}>
            {sideNews.map((item, idx) => (
              <Col span={24} key={item.id || idx}>
                <Card hoverable>
                  <Row gutter={8} align="middle">
                    <Col span={10}>
                      <img
                        alt={safeText(item.title)}
                        src={safeText(item.image) || "/path/to/default.jpg"}
                        style={{
                          width: "100%",
                          height: "120px",
                          objectFit: "cover",
                        }}
                      />
                    </Col>
                    <Col span={14}>
                      <Text strong>{safeText(item.title)}</Text>
                      <br />
                      <Text type="secondary">{safeText(item.summary)} </Text>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      {/* Trending News */}
      <div style={{ marginTop: 32 }}>
        <Title level={4}>Trending News</Title>
        <Row gutter={[24, 24]}>
          {trendingNews.map((item, idx) => (
            <Col xs={24} md={8} key={item.id || idx}>
              <Card
                hoverable
                cover={
                  <img
                    alt={safeText(item.title)}
                    src={safeText(item.image) || "/path/to/default.jpg"}
                    style={{ width: "100%", height: 200, objectFit: "cover" }}
                  />
                }
              >
                <Title level={5}>{safeText(item.title)}</Title>
                <Text type="secondary">{safeText(item.summary)}</Text>
                <Paragraph ellipsis={{ rows: 2 }}>
                  {safeText(item.description)}
                </Paragraph>

              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default HomePage2;
