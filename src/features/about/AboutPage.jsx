import { Typography, Card, Row, Col, Avatar } from 'antd';
import { TeamOutlined, GlobalOutlined, TrophyOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const AboutPage = () => {
  return (
    <div>
      <Title level={2}>Về chúng tôi</Title>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} md={16}>
          <Card>
            <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
              NewsHub là nền tảng tin tức hiện đại, cung cấp thông tin nhanh chóng và chính xác
              về các sự kiện quan trọng trong nước và quốc tế. Chúng tôi cam kết mang đến cho độc giả
              những tin tức chất lượng, đa dạng và cập nhật liên tục 24/7.
            </Paragraph>
            
            <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
              Với đội ngũ phóng viên và biên tập viên chuyên nghiệp, NewsHub tự hào là nguồn tin tức
              đáng tin cậy cho hàng triệu độc giả Việt Nam và quốc tế.
            </Paragraph>
          </Card>
        </Col>
        
        <Col xs={24} md={8}>
          <Card title="Thống kê">
            <div style={{ textAlign: 'center' }}>
              <Avatar size={64} icon={<GlobalOutlined />} style={{ backgroundColor: '#1890ff', marginBottom: 16 }} />
              <Title level={3}>1M+</Title>
              <Paragraph>Độc giả hàng tháng</Paragraph>
            </div>
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} md={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <Avatar size={48} icon={<TeamOutlined />} style={{ backgroundColor: '#52c41a', marginBottom: 16 }} />
              <Title level={4}>Đội ngũ chuyên nghiệp</Title>
              <Paragraph>
                Hơn 100 phóng viên và biên tập viên giàu kinh nghiệm
              </Paragraph>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} md={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <Avatar size={48} icon={<TrophyOutlined />} style={{ backgroundColor: '#faad14', marginBottom: 16 }} />
              <Title level={4}>Giải thưởng uy tín</Title>
              <Paragraph>
                Nhiều giải thưởng báo chí trong nước và quốc tế
              </Paragraph>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} md={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <Avatar size={48} icon={<GlobalOutlined />} style={{ backgroundColor: '#f5222d', marginBottom: 16 }} />
              <Title level={4}>Phủ sóng toàn cầu</Title>
              <Paragraph>
                Tin tức từ hơn 50 quốc gia và vùng lãnh thổ
              </Paragraph>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AboutPage; 