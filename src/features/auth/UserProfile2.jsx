import React, { useEffect, useState } from 'react';
import { userAPI } from '../../common/api';
import './UserProfile2.css';
import { useNavigate } from 'react-router-dom';
import { SUCCESS_STATUS, FAIL_STATUS } from '../../common/variable-const';

const UserProfile2 = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
    const fetchUser = async () => {
    const userId = localStorage.getItem('id');
      try {
        const response = await userAPI.getDetailUser(userId);
        const { status, data, errorMessage } = response;
        console.log("data - ")
        console.table(data);

        if (status === SUCCESS_STATUS) {
          setUserData(data);
        } else if (status === FAIL_STATUS) {
        //   alert(errorMessage || 'Không thể lấy thông tin người dùng');
        }
      } catch (error) {
        console.error('Lỗi lấy dữ liệu người dùng:', error);
        // alert('Có lỗi xảy ra khi tải thông tin người dùng.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  });

  const handleEdit = () => {
    navigate('/profile/edit');
  };

  if (loading) {
    return <div className="userprofile-loading">Đang tải thông tin...</div>;
  }

  if (!userData) {
    return <div className="userprofile-error">Không tìm thấy người dùng.</div>;
  }

  return (
    <div className="userprofile-container">
      <div className="userprofile-card">
        <h2>Thông tin người dùng</h2>
        <div className="form-group">
          <label>Họ và tên:</label>
          <input type="text" value={userData.fullname || ''} readOnly />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="text" value={userData.email || ''} readOnly />
        </div>
        <div className="form-group">
          <label>Số điện thoại:</label>
          <input type="text" value={userData.phone || 'Chưa cập nhật'} readOnly />
        </div>
        <div className="form-group">
          <label>Ngày tạo tài khoản:</label>
          <input
            type="text"
            value={
              userData.createdAt
                ? new Date(userData.createdAt).toLocaleDateString()
                : ''
            }
            readOnly
          />
        </div>

        <button className="edit-button" onClick={handleEdit}>
          Chỉnh sửa thông tin
        </button>
      </div>
    </div>
  );
};

export default UserProfile2;
