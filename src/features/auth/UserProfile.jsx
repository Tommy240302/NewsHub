import React from 'react';
import './UserProfile.css';
import { useNavigate } from 'react-router-dom';

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
                    <li className="active" onClick={() => navigate('/userprofile')}>
                        <UserOutlined /> Thông tin tài khoản
                    </li>
                    <li onClick={() => navigate('')}>
                        <LockOutlined /> Đổi mật khẩu
                    </li>
                    <li onClick={() => navigate('')}>
                        <FileTextOutlined /> Hoạt động bình luận
                    </li>
                    <li onClick={() => navigate('/savenews')}>
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
                <h3>Thông tin tài khoản</h3>
                <div className="form-row">
                    <label>Tên hiển thị</label>
                    <Input placeholder="Quang Minh" />
                </div>
                <div className="form-row">
                    <label>Giới tính</label>
                    <Radio.Group defaultValue="other">
                        <Radio value="male">Nam</Radio>
                        <Radio value="female">Nữ</Radio>
                        <Radio value="other">Khác</Radio>
                    </Radio.Group>
                </div>
                <div className="form-row">
                    <label>Ngày sinh</label>
                    <div className="form-date-selects">
                        <Select defaultValue="1"><Option value="1">1</Option></Select>
                        <Select defaultValue="1"><Option value="1">1</Option></Select>
                        <Select defaultValue="2002"><Option value="2002">2002</Option></Select>
                    </div>
                </div>
                <div className="form-row">
                    <label>Email</label>
                    <Input defaultValue="laikhacminhquang24032002@gmail.com" />
                </div>
                <div className="form-row">
                    <label>Điện thoại</label>
                    <Input />
                </div>
                <div className="form-row">
                    <label>Địa chỉ</label>
                    <Input />
                </div>

                <Button type="primary" className="save-btn">Lưu thay đổi</Button>

                <h3 style={{ marginTop: '32px' }}>Liên kết tài khoản xã hội</h3>
                <div className="social-link-row">
                    <FacebookFilled style={{ color: '#1877f2' }} /> Tài khoản Facebook <Switch />
                </div>
                <div className="social-link-row">
                    <GoogleOutlined style={{ color: '#DB4437' }} /> Tài khoản Google <Switch />
                </div>
                <div className="social-link-row">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg" alt="Zalo" width={16} style={{ marginRight: 8 }} />
                    Tài khoản Zalo <Switch />
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
