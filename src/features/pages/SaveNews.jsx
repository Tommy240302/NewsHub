import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SaveNews.css';
import {
    UserOutlined,
    LockOutlined,
    FileTextOutlined,
    EyeOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import { Avatar, Spin } from 'antd';
import { newsAPI } from '../../common/api'; 
import { userAPI } from '../../common/api';
import { SUCCESS_STATUS } from '../../common/variable-const';

const UserProfile = () => {
    const navigate = useNavigate();
    const [myNews, setMyNews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchMyNews = async () => {
            try {
                setLoading(true);
                const res = await newsAPI.getMyNews();
                console.log("API my-news response:", res);
                setMyNews(res.data || []);
            } catch (err) {
                console.error("Lỗi lấy bài viết đã đăng:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMyNews();
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
    if (!userData) return <div className="profile-error">Không có dữ liệu người dùng.</div>;

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
                                <FileTextOutlined /> Tin đã đăng
                            </li>
                            
                            <li onClick={handleLogout}>
                                <LogoutOutlined /> Đăng xuất
                            </li>
                        </ul>
                    </div>

            <div className="profile-content">
                <h3>Bài viết đã đăng</h3>

                {loading ? (
                    <Spin size="large" />
                ) : (
                    <div className="saved-news-list">
                        {myNews.length === 0 ? (
                            <p>Bạn chưa đăng bài viết nào.</p>
                        ) : (
                            myNews.map((news) => (
                                <div
                                    className="saved-news-item"
                                    key={news.id}
                                    onClick={() => navigate(`/news/${news.id}`)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div
                                        className="news-thumbnail"
                                        style={{
                                            backgroundImage: `url(${news.image || '/no-image.jpg'})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                        }}
                                    />
                                    <div className="news-info">
                                        <h4 className="news-title">{news.title}</h4>
                                        <p className="news-meta">
                                            Ngày đăng:{' '}
                                            {news.publishedAt
                                                ? new Date(news.publishedAt).toLocaleString()
                                                : 'Chưa xác định'}
                                        </p>
                                        <p className="news-meta">Lượt xem: {news.view}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
