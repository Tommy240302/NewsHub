import { Menu } from 'antd';
import {
  HomeOutlined,
  FireOutlined,
  StarOutlined,
  BookOutlined,
  VideoCameraOutlined,
  PictureOutlined,
} from '@ant-design/icons';

const NAVBAR_HEIGHT_PX = 64; 
const SIDEBAR_WIDTH = 200;
const Sidebar = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: NAVBAR_HEIGHT_PX,
        left: 0,
        height: `calc(100vh - ${NAVBAR_HEIGHT_PX}px)`,
        width: SIDEBAR_WIDTH,
        background: '#fff',
        borderRight: '1px solid #f0f0f0',
        overflowY: 'auto',
        zIndex: 100,
      }}
    >
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
    </div>
  );
};

export default Sidebar;
