import React, { useEffect, useState } from "react";
import { newsAPI } from "../../common/api";
import "@fontsource/merriweather";
import { useNavigate } from "react-router-dom";
import { PhoneOutlined } from "@ant-design/icons";

const safeText = (val) => (typeof val === "string" ? val : "");
const safeNumber = (val) => (typeof val === "number" ? val : 0);

const HomePage2 = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await newsAPI.getAllNews();
        const rawData = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
            ? res.data.data
            : [];

        const filtered = rawData.filter(
          (item) =>
            (item.isDeleted === false || item.isDeleted === 0) &&
            (item.status === true || item.status === 1)
        );

        const sorted = [...filtered].sort(
          (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
        );

        setNews(sorted);
      } catch (err) {
        console.error("Fetch news failed:", err);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  const mainNews = news[0];
  const sideNews = news.slice(1, 4);
  const trendingNews = news.slice(4, 7);
  const hotNews = news.slice(7, 10);
  const otherNews = news.slice(10, 100);

  // Hàm điều hướng đến trang chi tiết
  const handleNavigate = (id) => {
    if (id) navigate(`/news/${id}`);
  };

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto font-merriweather">
      {/* Featured Section */}
      <div className="flex items-stretch">
        {/* Main News */}
        <div className="">
          <div
            className="bg-white rounded-lg overflow-hidden shadow h-full cursor-pointer"
            onClick={() => handleNavigate(mainNews?.id)}
          >
            <img
              src={safeText(mainNews.image) || "/path/to/default.jpg"}
              alt={safeText(mainNews.title)}
              className="w-[750px] h-[350px] object-cover rounded-lg"
              style={{ borderRadius: "15px" }}
            />
            <div className="p-4 w-[750px] text-justify">
              <h2
                className="text-1xl font-bold mb-2 hover:text-red-600"
                onClick={() => handleNavigate(mainNews?.id)}
              >
                {safeText(mainNews.title)}
              </h2>
              <p className="text-gray-600">{safeText(mainNews.summary)}</p>
            </div>
          </div>
        </div>

        {/* Side News */}
        <div className="col-span-4 flex flex-col gap-[20px] h-[350px]">
          {sideNews.map((item, idx) => (
            <div
              key={item.id || idx}
              className="flex gap-3 bg-white rounded-lg overflow-hidden shadow p-2 flex-1 cursor-pointer hover:shadow-lg transition"
              onClick={() => handleNavigate(item?.id)}
            >
              <img
                src={safeText(item.image) || "/path/to/default.jpg"}
                alt={safeText(item.title)}
                className="flex-shrink-0 rounded-lg object-cover h-[100%] ml-[30px]"
                style={{ width: "170px", borderRadius: "15px" }}
              />
              <div className="p-2 flex flex-col text-justify">
                <h3
                  className="h-[50px] font-semibold text-xs line-clamp-2 hover:text-red-600"
                  style={{ paddingLeft: "15px" }}
                >
                  {safeText(item.title)}
                </h3>
                <p
                  className="text-[#44444E] text-[13px] mt-1 line-clamp-3"
                  style={{ paddingLeft: "15px" }}
                >
                  {safeText(item.summary)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending News */}
      <div className="mt-10">
        <div className="flex justify-between items-center mb-4">
          <h2
            className="text-xl font-bold"
            style={{
              paddingTop: "15px",
              paddingBottom: "20px",
              color: "#DC143C",
              fontSize: "24px",
            }}
          >
            TRENDING NEWS
          </h2>
          <h3
            onClick={() => navigate("/trendnews")}
            className="hover:underline text-sm font-medium"
            style={{ color: "#DC143C", cursor: "pointer" }}
          >
            See More →
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-[30px]">
          {trendingNews.map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-white rounded-xl shadow hover:shadow-lg flex flex-col overflow-hidden cursor-pointer"
              onClick={() => handleNavigate(item?.id)}
            >
              <img
                src={safeText(item.image) || "/path/to/default.jpg"}
                alt={safeText(item.title)}
                className="h-[200px] object-cover rounded-lg"
                style={{ borderRadius: "12px" }}
              />
              <div className="p-4 text-justify">
                <h3 className="h-[50px] text-lg font-semibold line-clamp-2 hover:text-red-600">
                  {safeText(item.title)}
                </h3>
                <p className="h-[60px] text-[13px] text-[#44444E] mt-2 line-clamp-2">
                  {safeText(item.summary)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <div
        className="bg-gradient-to-r rounded-2xl p-10 mb-10 relative overflow-hidden"
        style={{
          backgroundColor: "#19183B",
          height: "250px",
          borderRadius: "15px",
          marginTop: "30px",
        }}
      >
        <h1
          style={{
            color: "#fff",
            fontSize: "50px",
            fontWeight: "700",
            lineHeight: "32px",
            textAlign: "left",
            paddingTop: "30px",
            paddingLeft: "100px",
          }}
        >
          <span style={{ color: "#DC143C" }}>LATEST UPDATES ON </span>
          <br />
          <br />
          NATIONAL GLOBAL NEWS
        </h1>

        <p
          style={{
            color: "#fff",
            fontSize: "16px",
            lineHeight: "24px",
            paddingLeft: "100px",
            paddingTop: "30px",
          }}
        >
          DELIVERING REAL-TIME UPDATES AND THE LATEST HEADLINES DAILY.
        </p>
      </div>

      {/* Hot News */}
      <div className="mt-10">
        <div className="flex justify-between items-center mb-4">
          <h2
            className="text-xl font-bold"
            style={{
              paddingTop: "15px",
              paddingBottom: "20px",
              color: "#DC143C",
              fontSize: "24px",
            }}
          >
            HOT NEWS
          </h2>
          <h3
            onClick={() => navigate("/hotnews")}
            className="hover:underline text-sm font-medium"
            style={{ color: "#DC143C", cursor: "pointer" }}
          >
            See More →
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-[30px]">
          {hotNews.map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-white rounded-xl shadow hover:shadow-lg flex flex-col overflow-hidden cursor-pointer"
              onClick={() => handleNavigate(item?.id)}
            >
              <img
                src={safeText(item.image) || "/path/to/default.jpg"}
                alt={safeText(item.title)}
                className="h-[200px] object-cover rounded-lg"
                style={{ borderRadius: "12px" }}
              />
              <div className="p-4 text-justify">
                <h3 className="h-[50px] text-lg font-semibold line-clamp-2 hover:text-red-600">
                  {safeText(item.title)}
                </h3>
                <p className="h-[60px] text-[13px] text-[#44444E] mt-2 line-clamp-2">
                  {safeText(item.summary)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Other News */}
      <div className="mt-10">
        <div className="flex justify-between items-center mb-4">
          <h2
            className="text-xl font-bold"
            style={{
              paddingTop: "15px",
              paddingBottom: "20px",
              color: "#DC143C",
              fontSize: "24px",
            }}
          >
            OTHER NEWS
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-[30px]">
          {otherNews.map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-white rounded-xl shadow hover:shadow-lg flex flex-col overflow-hidden cursor-pointer"
              onClick={() => handleNavigate(item?.id)}
            >
              <img
                src={safeText(item.image) || "/path/to/default.jpg"}
                alt={safeText(item.title)}
                className="h-[200px] object-cover rounded-lg"
                style={{ borderRadius: "12px" }}
              />
              <div className="p-4 text-justify">
                <h3 className="h-[50px] text-lg font-semibold line-clamp-2 hover:text-red-600">
                  {safeText(item.title)}
                </h3>
                <p className="h-[60px] text-[13px] text-[#44444E] line-clamp-2">
                  {safeText(item.summary)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-[#D3DAD9] mt-[30px]">
        <div className="grid grid-cols-8 items-center h-[50px]">
          <div className="text-[#0f4c75] font-bold text-[16px]">
            <strong>&nbsp; JS NEWS HUB</strong>
          </div>
          <div></div>
          <div></div>
      
          <div className="text-[#44444E] cursor-pointer"
            onClick={() => navigate("/contact")}>
            Contact Us
          </div>
          <div className="text-[#44444E]">
            Privacy Policy
          </div>
          <div className="text-[#44444E]">
            Terms of Service
          </div>
          <div className="text-right text-[#44444E]">
            Đường dây nóng: 
          </div>
          <h3 className="text-center flex items-center justify-center gap-2">
            <PhoneOutlined /> &nbsp;
            0862382035&nbsp;</h3>
        </div>
        <div className="border-t border-[#D3DAD9]">
          <div className="grid grid-cols-3 mb-[-100px] mt-[10px]">
            <p className="leading-relaxed text-[#313647] text-[13px]">
              <strong>Báo tiếng Việt mới nhất</strong> <br />
              Đồ án tốt nghiệp của sinh viên <br />
              Học viện Công nghệ Bưu chính Viễn thông - PTIT <br />
              Địa chỉ: 97 Man Thiện, Phường Hiệp Phú, Quận 9, TP. Hồ Chí Minh <br />
              Ngành: Công nghệ thông tin <br />
              Khóa: D20CQCNPM-2 <br />
            </p>
            <p className="text-[#313647] text-[13px] text-center">
              <strong>Dưới sự hướng dẫn của thầy</strong><br/>
               Nguyễn Ngọc Duy <br />
              <strong>Được thực hiện bởi</strong> <br />
              Lại Khắc Minh Quang-N20DCCN056 <br />
              Nguyễn Tiến Đạt-N20DCCN060 <br />
            </p>
            <div className="text-right text-[#313647] text-[13px]">
              © 11 - 2025. Hoàn thiện vào tháng 11 - 2025&nbsp; <br />
              <strong>Email: </strong>
              laikhacminhquang24032002@gmail.com <br />
              <strong>Số điện thoại: </strong>
              0862382035 <br />
            </div>
          </div>

        </div>


      </div>
    </div>
  );
};

export default HomePage2;
