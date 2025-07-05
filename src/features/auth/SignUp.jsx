import React from 'react';
import { Form, Input, Button, Checkbox, Typography, Card } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './SignUp.css'; 

const { Title, Text } = Typography;

const SignUp = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Dữ liệu đăng ký:', values);
    // TODO: Gửi dữ liệu đến backend ở đây
  };

  return (
    <div className="signup-container">
      <Card className="signup-card">
        <Title level={2} className="signup-title">Đăng ký</Title>
        <Text className="signup-subtitle">Tạo tài khoản mới để bắt đầu trải nghiệm</Text>

        <Form
          form={form}
          name="signup"
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item
            label="Họ và tên"
            name="fullname"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
          >
            <Input placeholder="Nhập họ và tên" prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
            ]}
          >
            <Input placeholder="Nhập email của bạn" prefix={<MailOutlined />} />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password placeholder="Nhập mật khẩu của bạn" prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Nhập lại mật khẩu" prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item name="agree" valuePropName="checked">
            <Checkbox>Tôi đồng ý với các điều khoản</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Đăng ký
            </Button>
          </Form.Item>

          <div className="signup-footer">
            <Text>Đã có tài khoản? <Link to="/login">Đăng nhập</Link></Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default SignUp;
