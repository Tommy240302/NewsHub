import { Menu } from 'antd';
import {
  HomeOutlined,
  FireOutlined,
  StarOutlined,
  BookOutlined,
  VideoCameraOutlined,
  PictureOutlined,
} from '@ant-design/icons';

const Sidebar = () => {
  return (
    <Menu
      mode="inline"
      defaultSelectedKeys={['home']}
      style={{ height: '100%', borderRight: 0 }}
      items={[
        { key: 'home', icon: <HomeOutlined />, label: 'Trang chủ' },
        { key: 'hot', icon: <FireOutlined />, label: 'Tin nóng' },
        { key: 'featured', icon: <StarOutlined />, label: 'Tin nổi bật' },
        { key: 'sports', icon: <BookOutlined />, label: 'Thể thao' },
        { key: 'entertainment', icon: <VideoCameraOutlined />, label: 'Giải trí' },
        { key: 'tech', icon: <PictureOutlined />, label: 'Công nghệ' },
      ]}
    />
  );
};

export default Sidebar;
