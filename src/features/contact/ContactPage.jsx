import { Typography, Card, Row, Col, Form, Input, Button, Divider } from 'antd';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, SendOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const ContactPage = () => {
  const onFinish = (values) => {
    console.log('Form values:', values);
    // Handle form submission here
  };

  return (
    <div>
      <Title level={2}>Liên hệ</Title>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card title="Thông tin liên hệ">
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                <MailOutlined style={{ fontSize: 20, color: '#1890ff', marginRight: 12 }} />
                <div>
                  <Title level={5} style={{ margin: 0 }}>Email</Title>
                  <Paragraph style={{ margin: 0 }}>contact@newshub.vn</Paragraph>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                <PhoneOutlined style={{ fontSize: 20, color: '#52c41a', marginRight: 12 }} />
                <div>
                  <Title level={5} style={{ margin: 0 }}>Điện thoại</Title>
                  <Paragraph style={{ margin: 0 }}>1900-xxxx</Paragraph>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <EnvironmentOutlined style={{ fontSize: 20, color: '#faad14', marginRight: 12 }} />
                <div>
                  <Title level={5} style={{ margin: 0 }}>Địa chỉ</Title>
                  <Paragraph style={{ margin: 0 }}>
                    123 Đường ABC, Quận XYZ, Hà Nội
                  </Paragraph>
                </div>
              </div>
            </div>
            
            <Divider />
            
            <div>
              <Title level={4}>Giờ làm việc</Title>
              <Paragraph>Thứ 2 - Thứ 6: 8:00 - 18:00</Paragraph>
              <Paragraph>Thứ 7: 8:00 - 12:00</Paragraph>
              <Paragraph>Chủ nhật: Nghỉ</Paragraph>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card title="Gửi tin nhắn">
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item
                name="name"
                label="Họ và tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
              >
                <Input placeholder="Nhập họ và tên của bạn" />
              </Form.Item>
              
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' }
                ]}
              >
                <Input placeholder="Nhập email của bạn" />
              </Form.Item>
              
              <Form.Item
                name="subject"
                label="Tiêu đề"
                rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
              >
                <Input placeholder="Nhập tiêu đề tin nhắn" />
              </Form.Item>
              
              <Form.Item
                name="message"
                label="Nội dung"
                rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
              >
                <TextArea 
                  rows={4} 
                  placeholder="Nhập nội dung tin nhắn của bạn"
                />
              </Form.Item>
              
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  icon={<SendOutlined />}
                  size="large"
                  style={{ width: '100%' }}
                >
                  Gửi tin nhắn
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ContactPage; 