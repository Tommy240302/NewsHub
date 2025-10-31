import React, { useState } from 'react';
import { Card, Typography, Checkbox, Button } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './SignUp.css';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../common/api';
import { SUCCESS_STATUS, FAIL_STATUS } from '../../common/variable-const';
import { Phone } from '@mui/icons-material';
import axios from 'axios';


const { Title, Text } = Typography;

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
  lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    avatar: '',
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
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

 const registerRes = await authAPI.register({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
    });

    if (registerRes.status === SUCCESS_STATUS) {
      // 2️⃣ Nếu đăng ký thành công, tự động login
      const loginRes = await authAPI.login({
        email: formData.email,
        password: formData.password,
      });

      if (loginRes.status === SUCCESS_STATUS) {
        localStorage.setItem('token', loginRes.data.token);
        localStorage.setItem('id', loginRes.data.user.id);
        alert('Đăng ký và đăng nhập thành công!');
        navigate('/home2'); // chuyển đến trang chính
      } else {
        alert('Đăng ký thành công nhưng đăng nhập thất bại!');
      }
    } else {
      alert(registerRes.errorMessage || 'Đăng ký thất bại!');
    }
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
            <label>Họ</label>
            <div className="input-wrapper">
              <input
                type="text"
                name="firstName"
                placeholder="Nhập họ"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Tên</label>
            <div className="input-wrapper">
              <input
                type="text"
                name="lastName"
                placeholder="Nhập tên"
                value={formData.lastName}
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
