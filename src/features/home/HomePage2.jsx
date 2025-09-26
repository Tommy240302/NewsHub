import React, { useEffect, useState } from "react";
import { newsAPI } from "../../common/api";
import { transform } from "lodash";

const safeText = (val) => (typeof val === "string" ? val : "");
const safeNumber = (val) => (typeof val === "number" ? val : 0);

const HomePage2 = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

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
  const otherNews = news.slice(10, 19);

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      {/* Featured Section */}
      <div className="grid grid-cols-12 gap-6 items-stretch">
        {/* Main News */}
        <div className="col-span-8">
          <div className="bg-white rounded-lg overflow-hidden shadow h-full">
            <img
              src={safeText(mainNews.image) || "/path/to/default.jpg"}
              alt={safeText(mainNews.title)}
              className="w-[770px] h-[400px] object-cover rounded-lg"
              style={{ borderRadius: "12px" }}
            />
            <div className="p-4 w-[90%]">
              <h2 className="text-2xl font-bold mb-2">{safeText(mainNews.title)}</h2>
              <p className="text-gray-600">{safeText(mainNews.summary)}</p>
            </div>
          </div>
        </div>

        {/* Side News */}
        <div className="col-span-4 flex flex-col gap-4 h-full">
          {sideNews.map((item, idx) => (
            <div
              key={item.id || idx}
              className="flex gap-3 bg-white rounded-lg overflow-hidden shadow p-2 flex-1"
            >
              <img
                src={safeText(item.image) || "/path/to/default.jpg"}
                alt={safeText(item.title)}
                className="flex-shrink-0 rounded-lg object-cover"
                style={{ width: "150px", height: "140px", borderRadius: "8px" }}
              />
              <div className="p-2 flex flex-col">
                <h3
                  className="h-[50px] font-semibold text-sm line-clamp-2"
                  style={{ paddingLeft: "10px" }}
                >
                  {safeText(item.title)}
                </h3>
                <p
                  className="text-gray-500 text-xs mt-1 line-clamp-3"
                  style={{ paddingLeft: "10px" }}
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
          <h2 className="text-xl font-bold" 
          style={{ paddingTop: "15px", paddingBottom: "20px", color:"#DC143C", style: "bold", fontSize:"24px" }}>TRENDING NEWS</h2>
          <h3 className="text-blue-600 hover:underline text-sm font-medium"
            style={{ color: "#DC143C", cursor: "pointer" }}>
            See More →
          </h3>
        </div>
        <div className="w-full">
          <div className="grid grid-cols-3"
            style={{ gap: "30px" }}>
            {trendingNews.map((item, idx) => (
              <div
                key={item.id || idx}
                className="bg-white rounded-xl shadow hover:shadow-lg flex flex-col overflow-hidden"
              >
                <img
                  src={safeText(item.image) || "/path/to/default.jpg"}
                  alt={safeText(item.title)}
                  className="h-[200px] object-cover rounded-lg"
                  style={{ borderRadius: "12px" }}
                />
                <div className="p-4">
                  <h3 className="h-[40px] text-lg font-semibold line-clamp-2">
                    {safeText(item.title)}
                  </h3>
                  <p className="h-[60px] text-gray-500 text-sm mt-2 line-clamp-2"
                    style={{ paddingBottom: "5px" }}>
                    {safeText(item.summary)}
                  </p>
                  <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                    {safeText(item.description)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r rounded-2xl p-10 mb-10 relative overflow-hidden"
        style={{
          backgroundColor: "#19183B",
          height: "250px", borderRadius: "8px", marginTop: "30px"
        }}>
        <h1 className=" text-white"
          style={{
            color: "#fff",
            style: "bold ",
            fontSize: "50px",
            fontWeight: "700",
            lineHeight: "32px",
            textAlign: "left",
            paddingTop: "30px",
            paddingLeft: "100px"
          }}>
          <span style={{ color: "#DC143C" }}>LATEST UPDATES ON </span> <br /> <br />
          NATIONAL GLOBAL NEWS
        </h1>

        <p className=""
          style={{
            color: "#fff",
            fontSize: "16px",
            lineHeight: "24px",
            paddingLeft: "100px",
            paddingTop: "30px",
          }}>
          DELIVERING REAL-TIME UPDATES AND THE LATEST HEADLINES DAILY.
        </p>

      </div>

      {/* Hot News */}
      <div className="mt-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold" 
          style={{ paddingTop: "15px", paddingBottom: "20px", color: "#DC143C", fontSize:"24px", style:"bold" }}>HOT NEWS</h2>
          <h3 className="text-blue-600 hover:underline text-sm font-medium"
            style={{ color: "#DC143C", cursor: "pointer" }}>
            See More →
          </h3>
        </div>
        <div className="w-full">
          <div className="grid grid-cols-3"
            style={{ gap: "30px" }}>
            {hotNews.map((item, idx) => (
              <div
                key={item.id || idx}
                className="bg-white rounded-xl shadow hover:shadow-lg flex flex-col overflow-hidden"
              >
                <img
                  src={safeText(item.image) || "/path/to/default.jpg"}
                  alt={safeText(item.title)}
                  className="h-[200px] object-cover rounded-lg"
                  style={{ borderRadius: "12px" }}
                />
                <div className="p-4">
                  <h3 className="h-[40px] text-lg font-semibold line-clamp-2">
                    {safeText(item.title)}
                  </h3>
                  <p className="h-[60px] text-gray-500 text-sm mt-2 line-clamp-2"
                    style={{ paddingBottom: "5px" }}>
                    {safeText(item.summary)}
                  </p>
                  <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                    {safeText(item.description)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Other News */}
      <div className="mt-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold" 
          style={{ paddingTop: "15px", paddingBottom: "20px", color:"#DC143C", fontSize:"24px" }}>OTHER NEWS</h2>
          <h3 className="text-blue-600 hover:underline text-sm font-medium"
            style={{ color: "#DC143C", cursor: "pointer" }}>
            See More →
          </h3>
        </div>
        <div className="w-full">
          <div className="grid grid-cols-3"
            style={{ gap: "30px" }}>
            {otherNews.map((item, idx) => (
              <div
                key={item.id || idx}
                className="bg-white rounded-xl shadow hover:shadow-lg flex flex-col overflow-hidden"
              >
                <img
                  src={safeText(item.image) || "/path/to/default.jpg"}
                  alt={safeText(item.title)}
                  className="h-[200px] object-cover rounded-lg"
                  style={{ borderRadius: "12px" }}
                />  
                <div className="p-4">
                  <h3 className="h-[40px] text-lg font-semibold line-clamp-2">
                    {safeText(item.title)}
                  </h3>
                  <p className="h-[60px] text-gray-500 text-sm mt-2 line-clamp-2"
                    style={{ paddingBottom: "5px" }}>
                    {safeText(item.summary)}
                  </p>  
                  <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                    {safeText(item.description)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Additional spacing at the bottom */}
      <div
        style={{
          height: "250px",
          marginTop: "50px",
          backgroundColor: "#2C2C2C",
          marginLeft: "-120px",
          marginRight: "-120px",
          marginBottom: "-120px"
        }}>
        {/* Top section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
            gap: "40px",
            marginBottom: "40px",
          }}
        >
          {/* Logo + Slogan */}
          <div style={{ paddingTop: "30px", marginLeft: "40px" }}>
            <h2 style={{ color: "#DC143C", fontWeight: "bold", fontSize: "24px" }}>
              NEWSHUB
            </h2>
            <p style={{ marginTop: "10px", fontSize: "14px", color: "#F75270" }}>
              “Stay Informed, Stay Ahead with Breaking News and In-Depth Insights.”
            </p>
            <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
              <span>🌐</span>
              <span>🐦</span>
              <span>📸</span>
              <span>💼</span>
            </div>
          </div>

          {/* Contact */}
          <div style={{ paddingTop: "20px", }}>
            <h3 style={{ fontWeight: "bold", marginBottom: "10px", fontSize: "24px", color: "#DDF4E7" }}>Contact</h3>
            <div style={{ display: "grid", rowGap: "6px", color: "#fff", fontSize: "14px" }}>
            <p>Email</p>
            <p>Phone</p>
            <p>Address</p>
            <p>Call center</p>
            </div>
          </div>

          {/* Service */}
          <div style={{ paddingTop: "20px"}}>
            <h3 style={{ fontWeight: "bold", marginBottom: "10px", fontSize: "24px", color: "#DDF4E7" }}>Service</h3>
            <div style={{ color: "#fff", fontSize: "14px", display: "grid", rowGap: "6px" }}>
            <p>Contact Us</p>
            <p>FAQ</p>
            <p>Shipping & Returns</p>
            <p>Warranty</p>
            </div>
          </div>

          {/* Events */}
          <div style={{ paddingTop: "20px" }}>
            <h3 style={{ fontWeight: "bold", marginBottom: "10px", fontSize: "24px", color: "#DDF4E7" }}>Events</h3>
            <div style={{ color: "#fff", fontSize: "14px", display: "grid", rowGap: "6px" }}>
            <p>Summer 2023</p>
            <p>Spring 2023</p>
            <p>NYFW 2023</p>
            <p>PFW 2023</p>
            </div>
          </div>

          {/* Follow Us */}
          <div style={{ paddingTop: "20px" }}>
            <h3 style={{ fontWeight: "bold", marginBottom: "10px", fontSize: "24px", color: "#DDF4E7" }}>Follow Us</h3>
            <div style={{ color: "#fff", fontSize: "14px", display: "grid", rowGap: "6px" }}>
            <p>Facebook</p>
            <p>Instagram</p>
            <p>Pinterest</p>
            <p>Twitter</p>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div
          style={{
            borderTop: "1px solid #444",
            paddingTop: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "14px",
            color: "#aaa",
            paddingLeft: "40px",
            paddingRight: "40px"
          }}
        >
          <p>All rights reserved © 2025</p>
          <div style={{ display: "flex", gap: "20px" }}>
            <span>📞 +84 862 382 035</span>
            <span>📍 Ho Chi Minh City, Viet Nam</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default HomePage2;
