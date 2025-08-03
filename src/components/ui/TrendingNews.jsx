import { Card, List, Typography, Badge } from 'antd';

const { Text } = Typography;

const TrendingNews = ({ trendingNews }) => {
  return (
    <Card title="Tin trending" style={{ marginBottom: 16 }}>
      <List
        dataSource={trendingNews}
        locale={{ emptyText: 'Không có bài viết nào.' }}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text strong style={{ fontSize: 14 }}>
                    {item.title}
                  </Text>
                  <Badge count={item.view} style={{ backgroundColor: '#52c41a' }} />
                </div>
              }
              description={
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {item.publishedAt ? new Date(item.publishedAt).toLocaleString() : ''}
                </Text>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default TrendingNews; 