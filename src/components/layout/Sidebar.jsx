import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import {
  HomeOutlined,
  FireOutlined,
  StarOutlined,
  MenuOutlined,
  TrophyOutlined,
  GlobalOutlined,
  TeamOutlined,
  LaptopOutlined,
  HeartOutlined,
  SmileOutlined,
  BookOutlined,
  ReadOutlined,
  BarChartOutlined,
  DribbbleOutlined,
} from '@ant-design/icons';


const Sidebar = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 64,
        left: 0,
        height: `calc(100vh - 64px)`,
        width: 200,
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
      >
        <Menu.Item key="home" icon={<HomeOutlined />}>
          <Link to="/home">Trang chủ</Link>
        </Menu.Item>

        <Menu.Item key="hot" icon={<FireOutlined />}>
          <Link to="/hotnews">Tin nóng</Link>
        </Menu.Item>

        <Menu.Item key="featured" icon={<StarOutlined />}>
          <Link to="/trendnews">Tin nổi bật</Link>
        </Menu.Item>

        <Menu.SubMenu key="topics" icon={<MenuOutlined />} title="Chuyên mục">
          <Menu.Item key="bongda" icon={<TrophyOutlined />}>
            <Link to="/chuyen-muc/bong-da">Bóng đá</Link>
          </Menu.Item>
          <Menu.Item key="thegioi" icon={<GlobalOutlined />}>
            <Link to="/chuyen-muc/the-gioi">Thế giới</Link>
          </Menu.Item>
          <Menu.Item key="xahoi" icon={<TeamOutlined />}>
            <Link to="/chuyen-muc/xa-hoi">Xã hội</Link>
          </Menu.Item>
          <Menu.Item key="vanhoa" icon={<ReadOutlined />}>
            <Link to="/chuyen-muc/van-hoa">Văn hóa</Link>
          </Menu.Item>
          <Menu.Item key="kinhte" icon={<BarChartOutlined />}>
            <Link to="/chuyen-muc/kinh-te">Kinh tế</Link>
          </Menu.Item>
          <Menu.Item key="giaoduc" icon={<BookOutlined />}>
            <Link to="/chuyen-muc/giao-duc">Giáo dục</Link>
          </Menu.Item>
          <Menu.Item key="thethao" icon={<DribbbleOutlined />}>
            <Link to="/chuyen-muc/the-thao">Thể thao</Link>
          </Menu.Item>
          <Menu.Item key="giaitri" icon={<SmileOutlined />}>
            <Link to="/chuyen-muc/giai-tri">Giải trí</Link>
          </Menu.Item>
          <Menu.Item key="doisong" icon={<HeartOutlined />}>
            <Link to="/chuyen-muc/doi-song">Đời sống</Link>
          </Menu.Item>
          <Menu.Item key="congnghe" icon={<LaptopOutlined />}>
            <Link to="/chuyen-muc/cong-nghe">Công nghệ</Link>
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>
    </div>
  );
};

export default Sidebar;
