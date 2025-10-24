import React, { useState } from 'react';
import { Button, Checkbox } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import './SignUp.css';
import { authAPI } from '../../common/api';
import { SUCCESS_STATUS } from '../../common/variable-const';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    agree: false,
  });

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Gửi yêu cầu đổi mật khẩu
  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = localStorage.getItem('email'); // lấy email người dùng
    if (!email) {
      alert('Bạn cần đăng nhập để đổi mật khẩu!');
      return;
    }

    const { oldPassword, newPassword, confirmPassword, agree } = formData;

    if (!oldPassword || !newPassword || !confirmPassword) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('Mật khẩu mới và xác nhận không khớp!');
      return;
    }

    if (!agree) {
      alert('Bạn cần đồng ý với điều khoản!');
      return;
    }

    try {
      const res = await authAPI.resetPassword(email, oldPassword, newPassword);

      if (res.status === SUCCESS_STATUS) {
        alert('Đổi mật khẩu thành công!');
        navigate('/home');
      } else {
        alert(res.errorMessage || 'Đổi mật khẩu thất bại!');
      }
    } catch (error) {
      console.error(error);
      alert('Có lỗi xảy ra khi đổi mật khẩu!');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h1>Đổi mật khẩu</h1>
          <p>Vui lòng nhập mật khẩu cũ và mật khẩu mới</p>
        </div>

        <form onSubmit={handleSubmit} className="sign-up-form">
          <div className="form-group">
            <label>Mật khẩu hiện tại</label>
            <div className="input-wrapper">
              <input
                type="password"
                name="oldPassword"
                placeholder="Nhập mật khẩu hiện tại"
                value={formData.oldPassword}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Mật khẩu mới</label>
            <div className="input-wrapper">
              <input
                type="password"
                name="newPassword"
                placeholder="Nhập mật khẩu mới"
                value={formData.newPassword}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Xác nhận mật khẩu mới</label>
            <div className="input-wrapper">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Nhập lại mật khẩu mới"
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

          <Button type="primary" htmlType="submit" block className="signup-button">
            Xác nhận đổi mật khẩu
          </Button>

          <div className="signup-footer">
            <p>
              Quay lại{' '}
              <Link to="/home" className="register-link">
                Trang chủ
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
