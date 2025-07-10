import React, { useState } from 'react';
import { Card, Typography, Checkbox, Button } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './SignUp.css';

const { Title, Text } = Typography;

const Signup = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.fullname || !formData.email || !formData.password || !formData.confirmPassword) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }

    if (!formData.agree) {
      alert('Bạn cần đồng ý với các điều khoản!');
      return;
    }

    // Submit logic ở đây
    console.log('Dữ liệu đăng ký:', formData);
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h1>Đăng Kí</h1>
          <p>Tạo tài khoản mới để bắt đầu trải nghiệm</p>
        </div>

        <form onSubmit={handleSubmit} className='sign-up-form'>
          <div className="form-group">
            <label>Họ và tên</label>
            <div className="input-wrapper">

              <input
                type="text"
                name="fullname"
                placeholder="Nhập họ và tên"
                value={formData.fullname}
                onChange={handleChange}
                required
                className="form-input"
              />

            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">

              <input
                type="email"
                name="email"
                placeholder="Nhập email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <div className="input-wrapper">

              <input
                type="password"
                name="password"
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Xác nhận mật khẩu</label>
            <div className="input-wrapper">

              <input
                type="password"
                name="confirmPassword"
                placeholder="Nhập lại mật khẩu"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="check-options">
            <Checkbox
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
            >
              Tôi đồng ý với các điều khoản
            </Checkbox>
          </div>

          <Button type="primary" htmlType="submit" block className='signup-button'>
            Đăng ký
          </Button>

          <div className="signup-footer">
            <p>Đã có tài khoản?{' '}
              <Link to="/login" className='register-link'>
                Đăng nhập
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
