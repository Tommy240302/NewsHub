import { useEffect, useState } from "react";
import "./NewsDetail.css";
import { useParams, useNavigate } from "react-router-dom";
import { newsAPI } from "../../common/api";
import { userAPI } from "../../common/api";
import NotificationModalFactory from "../../components/NotificationModal/NotificationModalFactory";
import HtmlDisplay from "./htmlDisplay";
import { Button } from "antd";
import ipify from "../../services/ipify";

export default function NewsDetailPage() {
  const [comments, setComments] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  const [commentUser, setCommentUser] = useState("");
  const [authorName, setAuthorName] = useState("Author");
  const [category, setCategory] = useState({
    id: "",
    content: "",
  });
  const [publishDate, setPublishDate] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [view, setView] = useState(0);
  const [htmlContent, setHtmlContent] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [commentLoading, setCOmmentLoading] = useState(false);

  const [visible, setVisible] = useState(false);
  const [typeNotify, setTypeNotify] = useState("info");
  const [notifyData, setNotifyData] = useState({
    message: "",
    description: "",
  });

  function convertDate(dateStr) {
    const date = new Date(dateStr);
    const localTime = date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    return localTime;
  }
  const fetchComment = async () => {
    try {
      const response = await newsAPI.getCommentByNewsId(id);
      const data = response.data;
      setComments(data);
    } catch (error) {
      console.error("Lỗi khi gọi API comment:", error);
    }
  };
  useEffect(() => {
    const countview = setTimeout(async () => {
      const ipv4 = await ipify();
      newsAPI.addView({
        newsId: id,
        ipV4: ipv4,
      });
    }, 2 * 60 * 1000);
    const fetchNewsById = async () => {
      try {
        const response = await newsAPI.getNewsById(id);
        const data = response.data;
        setHtmlContent(data.content);
        setPublishDate(convertDate(data.publishedAt));
        setTitle(data.title);
        setSummary(data.summary);
        setAuthorName(data.authorName);
        setView(data.view);
        setCategory({
          id: data.category.id,
          content: data.category.content,
        });
      } catch (error) {
        console.error("Lỗi khi gọi API News:", error);
      }
    };
    fetchNewsById();
    fetchComment();
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
    return () => clearTimeout(countview);
  }, []);

  const handleSubmit = async () => {
    setCOmmentLoading(true);
    const requestComment = {
      comment: commentUser,
      newsId: id,
    };
    try {
      const response = await userAPI.addComment(requestComment);
      if (response.data.approved) {
        await fetchComment();
      } else {
        setNotifyData({
          message: "Cảnh báo",
          description:
            "Phản hồi của bạn không phù hợp tiêu chuẩn (độc hại hoặc spam)",
        });
        setTypeNotify("error");
        setVisible(true);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API thêm comment:", error);
    } finally {
      setCommentUser("");
      setCOmmentLoading(false);
    }
  };

  return (
    <div id="main">
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          background: "white",
          boxShadow: "0 0 20px rgba(0,0,0,0.1)",
        }}
      >
        <article>
          <div id="main-article">
            <div>
              <span
                id="category">{category.content}</span>
            </div>
            <div>
              <span>Tác giả: {authorName}</span> |{" "}
              <span>Đăng vào {publishDate}</span> |<span>Lượt xem: {view}</span>
            </div>
          </div>

          <h1 id="title">{title}</h1>

          <p
            id="summary"
            style={{
              fontSize: '14px',
              color: '#666',
              marginBottom: '1.5rem',
              fontStyle: 'italic',
            }}
          >
            {summary}
          </p>
          <HtmlDisplay htmlContent={htmlContent}></HtmlDisplay>
        </article>

        <section
          style={{
            background: "#f8f9fa",
            padding: "2rem",
            borderTop: "3px solid #1a237e",
          }}
        >
          <h2
            style={{
              fontSize: "1.3rem",
              fontWeight: "bold",
              marginBottom: "1.5rem",
              color: "#1a237e",
            }}
          >
            Comments
          </h2>

          <div
            style={{
              color: "#666",
              fontSize: "0.7rem",
              marginBottom: "1rem",
            }}
          >
            <span>{comments.length}</span> comments
          </div>
          {isLoggedIn ? (
            <div id="commentForm">
              <div style={{ marginBottom: "1rem" }}>
                <label
                  htmlFor="commentText"
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  Comment
                </label>
                <textarea
                  id="commentText"
                  name="commentText"
                  value={commentUser}
                  onChange={(e) => setCommentUser(e.target.value)}
                  placeholder="Chia sẻ suy nghỉ của bạn"
                  required
                />
              </div>

              <Button
                id="submmitButton"
                onClick={handleSubmit}
                loading={commentLoading}
                disabled={!commentUser.trim()}
              >
                {commentLoading ? "Đang xử lý..." : "Đăng"}
              </Button>
            </div>
          ) : (
            <button id="loginButton" onClick={() => navigate("/login")}>
              Đăng nhập để bình luận
            </button>
          )}
          {comments.map((comment) => (
            <div class="comment">
              <div class="comment-main">
                <div class="comment-content-wrapper">
                  <div class="comment-header">
                    <div class="comment-author-section">
                      <div class="comment-avatar">
                        <img
                          src={
                            comment.user.avatar ||
                            "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="
                          }
                          alt="avatar"
                        />
                      </div>
                      <span class="comment-author">
                        {comment.user.firstName + " " + comment.user.lastName}
                      </span>
                    </div>
                    <span class="comment-date">
                      {convertDate(comment.createAt)}
                    </span>
                  </div>
                  <div class="comment-content">{comment.content}</div>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
      <NotificationModalFactory
        type={typeNotify}
        visible={visible}
        onClose={() => setVisible(false)}
        message={notifyData.message}
        description={notifyData.description}
      />
    </div>
  );
}
