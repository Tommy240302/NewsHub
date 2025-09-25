import React, { useEffect, useState } from "react";
import { newsAPI } from "../../common/api";

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
  const trendingNews = news.slice(4);

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
                style={{ width: "150px", height: "140px" }}
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
          <h2 className="text-xl font-bold">Trending News</h2>
          <button className="text-blue-600 hover:underline text-sm font-medium">
            See More →
          </button>
        </div>
        <div className="max-w-7xl">
          <div className="grid grid-cols-3">
            {trendingNews.map((item, idx) => (
              <div
                key={item.id || idx}
                className="bg-white rounded-xl shadow hover:shadow-lg flex flex-col overflow-hidden"
              >
                <img
                  src={safeText(item.image) || "/path/to/default.jpg"}
                  alt={safeText(item.title)}
                  className="w-[390px] h-[200px] object-cover rounded-lg"
                />
                <div className="p-4 w-[390px]">
                  <h3 className="text-lg font-semibold line-clamp-2">
                    {safeText(item.title)}
                  </h3>
                  <p className="text-gray-500 text-sm mt-2 line-clamp-2">
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
    </div>
  );
};

export default HomePage2;
