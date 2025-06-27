import { Card, Tag, Typography, Button } from 'antd';
import { StarOutlined, UserOutlined, FireOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const NewsCard = ({ news }) => {
  return (
    <Card
      hoverable
      cover={
        <img
          alt={news.title}
          src={news.image}
          style={{ height: 200, objectFit: 'cover' }}
        />
      }
      actions={[
        <Button type="text" icon={<StarOutlined />}>Lưu</Button>,
        <Button type="text" icon={<UserOutlined />}>Chia sẻ</Button>
      ]}
    >
      <Card.Meta
        title={
          <div>
            <Tag color={news.hot ? 'red' : 'blue'} style={{ marginBottom: 8 }}>
              {news.hot ? <FireOutlined /> : <StarOutlined />} {news.category}
            </Tag>
            <Title level={5} style={{ margin: 0 }}>
              {news.title}
            </Title>
          </div>
        }
        description={
          <div>
            <Paragraph ellipsis={{ rows: 2 }}>
              {news.summary}
            </Paragraph>
            <Text type="secondary">{news.time}</Text>
          </div>
        }
      />
    </Card>
  );
};

export default NewsCard; 