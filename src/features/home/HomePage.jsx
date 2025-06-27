import { Carousel, Typography, Tag, Row, Col } from 'antd';
import { FireOutlined, StarOutlined } from '@ant-design/icons';
import NewsCard from '../../components/ui/NewsCard';
import TrendingNews from '../../components/ui/TrendingNews';
import WeatherWidget from '../../components/ui/WeatherWidget';
import { NAVBAR_HEIGHT_PX } from '../../components/layout/Navbar';

const { Title, Text, Paragraph } = Typography;

const HomePage = () => {
  const featuredNews = [
    {
      id: 1,
      title: "Công nghệ AI đột phá: ChatGPT-5 ra mắt với khả năng đa phương tiện",
      summary: "OpenAI vừa công bố phiên bản ChatGPT-5 với những cải tiến đáng kể về khả năng xử lý hình ảnh và video...",
      category: "Công nghệ",
      time: "2 giờ trước",
      image: "https://via.placeholder.com/400x250/1890ff/ffffff?text=AI+News",
      hot: true
    },
    {
      id: 2,
      title: "Việt Nam đăng cai SEA Games 2025: Chuẩn bị hoàn tất",
      summary: "Với thời gian còn lại chưa đầy 1 năm, Việt Nam đang gấp rút hoàn thiện các công trình phục vụ SEA Games...",
      category: "Thể thao",
      time: "4 giờ trước",
      image: "https://via.placeholder.com/400x250/52c41a/ffffff?text=Sports",
      hot: false
    },
    {
      id: 3,
      title: "Thị trường chứng khoán: VN-Index tăng mạnh phiên cuối tuần",
      summary: "Chỉ số VN-Index đã tăng 2.5% trong phiên giao dịch cuối tuần, đánh dấu tuần tăng trưởng tích cực...",
      category: "Kinh tế",
      time: "6 giờ trước",
      image: "https://via.placeholder.com/400x250/faad14/ffffff?text=Finance",
      hot: true
    }
  ];

  const trendingNews = [
    {
      id: 4,
      title: "Bộ Y tế công bố hướng dẫn mới về phòng chống dịch bệnh",
      time: "1 giờ trước",
      views: "15.2K"
    },
    {
      id: 5,
      title: "Hà Nội: Dự án metro số 3 chính thức khởi công",
      time: "3 giờ trước",
      views: "12.8K"
    },
    {
      id: 6,
      title: "Giá xăng dầu: Dự báo tăng nhẹ trong tuần tới",
      time: "5 giờ trước",
      views: "10.5K"
    },
    {
      id: 7,
      title: "Giải bóng đá V-League: Kết quả vòng 15",
      time: "7 giờ trước",
      views: "8.9K"
    }
  ];

  return (
    <div style={{paddingTop: NAVBAR_HEIGHT_PX}}>
      {/* Carousel tin nổi bật */}
      <Carousel autoplay dotPosition='bottom' effect='fade' style={{ marginBottom: 24 }}>
        {featuredNews.map(news => (
          <div key={news.id}>
            <div style={{ 
              position: 'relative', 
              height: 400, 
              background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${news.image})`, 
              backgroundSize: 'cover', 
              backgroundPosition: 'center', 
              borderRadius: 8, 
              display: 'flex', 
              alignItems: 'flex-end', 
              padding: 24 
            }}>
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
                  {news.time}
                </Text>
              </div>
            </div>
          </div>
        ))}
      </Carousel>

      <Row gutter={24}>
        {/* Tin tức chính */}
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

        {/* Sidebar */}
        <Col xs={24} lg={8}>
          <div style={{ position: 'sticky', top: 100 }}>
            <TrendingNews trendingNews={trendingNews} />
            <WeatherWidget />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default HomePage; 