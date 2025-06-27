import { Card, Typography } from 'antd';

const { Title, Text } = Typography;

const WeatherWidget = () => {
  return (
    <Card title="Thời tiết Hà Nội">
      <div style={{ textAlign: 'center' }}>
        <Title level={2} style={{ margin: 0, color: '#1890ff' }}>28°C</Title>
        <Text>Nắng đẹp, độ ẩm 65%</Text>
      </div>
    </Card>
  );
};

export default WeatherWidget; 