import React from 'react';
import { useNavigate } from 'react-router-dom';

import './SaveNews.css';
import {
    UserOutlined,
    LockOutlined,
    FileTextOutlined,
    EyeOutlined,
    LogoutOutlined,
    FacebookFilled,
    GoogleOutlined
} from '@ant-design/icons';
import { Avatar, Input, Button, Select, Radio, Switch } from 'antd';

const { Option } = Select;

const UserProfile = () => {
    const navigate = useNavigate();

    return (
        <div className="profile-container">
            <div className="profile-sidebar">
                <div className="profile-avatar">
                    <Avatar size={96} src="/avatar.jpg" icon={<UserOutlined />} />

                    <div className="profile-name">Quang Minh</div>
                </div>
                <ul className="profile-menu">
                    <li onClick={() => navigate('/userprofile')}>
                        <UserOutlined /> Thông tin tài khoản
                    </li>
                    <li onClick={() => navigate('')}>
                        <LockOutlined /> Đổi mật khẩu
                    </li>
                    <li onClick={() => navigate('')}>
                        <FileTextOutlined /> Hoạt động bình luận
                    </li>
                    <li className="active" onClick={() => navigate('/savenews')}>
                        <FileTextOutlined /> Tin đã lưu
                    </li>
                    <li onClick={() => navigate('')}>
                        <EyeOutlined /> Tin đã xem
                    </li>
                    <li onClick={() => navigate('')}>
                        <LogoutOutlined /> Đăng xuất
                    </li>
                </ul>
            </div>

            <div className="profile-content">
                <h3>Tin đã lưu</h3>
                <div className="saved-news-list">
                    {/* Card tin đã lưu - lặp cho mỗi bài */}
                    <div className="saved-news-item">
                        <div className="news-thumbnail" />
                        <div className="news-info">
                            <h4 className="news-title">Tiêu đề bài viết đã lưu</h4>
                            <p className="news-meta">Lưu lúc: 23/07/2025 - 14:32</p>
                        </div>
                    </div>

                    <div className="saved-news-item">
                        <div className="news-thumbnail" />
                        <div className="news-info">
                            <h4 className="news-title">Tiêu đề bài viết khác</h4>
                            <p className="news-meta">Lưu lúc: 20/07/2025 - 09:15</p>
                        </div>
                    </div>

                    {/* Thêm các ô khác nếu muốn */}
                </div>

            </div>
        </div>
    );
};

export default UserProfile;
