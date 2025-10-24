import React, { useEffect, useState } from 'react';
import './UserProfile.css';
import { useNavigate } from 'react-router-dom';
import {
    UserOutlined,
    LockOutlined,
    FileTextOutlined,
    EyeOutlined,
    LogoutOutlined,
    FacebookFilled,
    GoogleOutlined,
} from '@ant-design/icons';
import { Avatar, Input, Button, Switch } from 'antd';
import { userAPI } from '../../common/api';
import { SUCCESS_STATUS } from '../../common/variable-const';

const UserProfile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await userAPI.getMe();
                if (response.status === SUCCESS_STATUS) {
                    setUserData(response.data);
                }
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu user:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const displayValue = (value) => {
        return value ?? 'Chưa cập nhật';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Chưa cập nhật';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Chưa cập nhật';
        return date.toLocaleDateString('vi-VN');
    };

    if (loading) return <div className="profile-loading">Đang tải...</div>;
    if (!userData) return <div className="profile-error">Bạn chưa đăng nhập.</div>;

    return (
        <div className="profile-container">
            <div className="profile-sidebar">
                <div className="profile-avatar">
                    <Avatar
                        size={96}
                        src={userData.avatar || '/default-avatar.jpg'}
                        icon={<UserOutlined />}
                    />
                    <div className="profile-name">{displayValue(userData.firstName)} {displayValue(userData.lastName)}</div>
                </div>
                <ul className="profile-menu">
                    <li className="active" onClick={() => navigate('/userprofile')}>
                        <UserOutlined /> Thông tin tài khoản
                    </li>
                    <li onClick={() => navigate('/changepassword')}>
                        <LockOutlined /> Đổi mật khẩu
                    </li>
                    <li onClick={() => navigate('')}>
                        <FileTextOutlined /> Hoạt động bình luận
                    </li>
                    <li onClick={() => navigate('/savenews')}>
                        <FileTextOutlined /> Tin đã đăng
                    </li>
                
                    <li onClick={handleLogout}>
                        <LogoutOutlined /> Đăng xuất
                    </li>
                </ul>
            </div>

            <div className="profile-content">
                <h3>Thông tin tài khoản</h3>
                <div className="form-row">
                    <label>Họ</label>
                    <Input value={displayValue(userData.firstName)} readOnly />
                </div>
                <div className="form-row">
                    <label>Tên</label>
                    <Input value={displayValue(userData.lastName)} readOnly />
                </div>
                <div className="form-row">
                    <label>Email</label>
                    <Input value={displayValue(userData.email)} readOnly />
                </div>
                <div className="form-row">
                    <label>Ngày sinh</label>
                    <Input value={formatDate(userData.dateOfBirth)} readOnly />
                </div>
                <div className="form-row">
                    <label>Điện thoại</label>
                    <Input value={displayValue(userData.phone)} readOnly />
                </div>
                <div className="form-row">
                    <label>Ngày tạo tài khoản</label>
                    <Input value={userData.createDay || 'Chưa cập nhật'} readOnly />
                </div>


                <Button type="primary" className="save-btn" onClick={() => navigate('')}>
                    Chỉnh sửa thông tin
                </Button>

                <h3 style={{ marginTop: '32px' }}>Liên kết tài khoản xã hội</h3>
                <div className="social-link-row">
                    <FacebookFilled style={{ color: '#1877f2' }} /> Facebook <Switch defaultChecked />
                </div>
                <div className="social-link-row">
                    <GoogleOutlined style={{ color: '#DB4437' }} /> Google <Switch />
                </div>
                <div className="social-link-row">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg"
                        alt="Zalo"
                        width={16}
                        style={{ marginRight: 8 }}
                    />
                    Zalo <Switch />
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
