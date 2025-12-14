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

  const [commentLoading, setCommentLoading] = useState(false);

  // Reply functionality states
  const [replyStates, setReplyStates] = useState({});
  const [replyTexts, setReplyTexts] = useState({});
  const [replyLoadings, setReplyLoadings] = useState({});

  // Show more/less functionality for nested replies AND main comments
  const [expandedReplies, setExpandedReplies] = useState({});
  const [showMoreComments, setShowMoreComments] = useState(false);

  const INITIAL_REPLIES_SHOW = 0; // Hide ALL replies by default
  const INITIAL_COMMENTS_SHOW = 3; // Show first 3 main comments initially

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
      console.log("Raw comments from API:", data); // Debug log
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
    setCommentLoading(true);
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
      setCommentLoading(false);
    }
  };

  // Reply functionality handlers
  const toggleReplyForm = (commentId) => {
    setReplyStates((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleReplyTextChange = (commentId, text) => {
    setReplyTexts((prev) => ({
      ...prev,
      [commentId]: text,
    }));
  };

  const toggleShowMoreReplies = (commentId) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const toggleShowMoreComments = () => {
    setShowMoreComments((prev) => !prev);
  };

  const handleReplySubmit = async (parentCommentId) => {
    const replyText = replyTexts[parentCommentId];
    if (!replyText?.trim()) return;

    setReplyLoadings((prev) => ({
      ...prev,
      [parentCommentId]: true,
    }));

    const requestReply = {
      comment: replyText,
      newsId: id,
      parentCommentId: parentCommentId,
    };

    try {
      const response = await userAPI.addComment(requestReply);
      if (response.data.approved) {
        await fetchComment();
        // Clear reply form and close it
        setReplyTexts((prev) => ({
          ...prev,
          [parentCommentId]: "",
        }));
        setReplyStates((prev) => ({
          ...prev,
          [parentCommentId]: false,
        }));
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
      console.error("Lỗi khi gọi API thêm reply:", error);
      setNotifyData({
        message: "Lỗi",
        description: "Không thể gửi phản hồi. Vui lòng thử lại sau.",
      });
      setTypeNotify("error");
      setVisible(true);
    } finally {
      setReplyLoadings((prev) => ({
        ...prev,
        [parentCommentId]: false,
      }));
    }
  };

  // Helper function to organize comments and replies recursively
  const organizeComments = (comments) => {
    const commentMap = {};
    const topLevelComments = [];

    // First pass: create map of all comments with empty replies array
    comments.forEach((comment) => {
      commentMap[comment.id] = {
        ...comment,
        replies: [],
      };
    });

    // Second pass: organize into tree structure
    comments.forEach((comment) => {
      if (comment.parentCommentId && commentMap[comment.parentCommentId]) {
        // This is a reply - add to parent's replies array
        commentMap[comment.parentCommentId].replies.push(
          commentMap[comment.id]
        );
      } else if (!comment.parentCommentId) {
        // This is a top-level comment
        topLevelComments.push(commentMap[comment.id]);
      }
    });

    return topLevelComments;
  };

  const renderComment = (comment, depth = 0) => {
    const isReply = depth > 0;
    const maxDepth = 6; // Allow deeper nesting like Facebook
    const shouldShowReplyButton = depth < maxDepth && isLoggedIn;

    return (
      <div
        key={comment.id}
        className={`comment ${isReply ? "reply-comment" : ""}`}
        style={{
          marginLeft: isReply ? `${Math.min(depth * 15, 90)}px` : "0",
          borderLeft: isReply ? "2px solid #e0e7ff" : "none",
          paddingLeft: isReply ? "15px" : "0",
          marginBottom: depth > 0 ? "1rem" : "1.5rem",
        }}
      >
        <div className="comment-main">
          <div className="comment-content-wrapper">
            <div className="comment-header">
              <div className="comment-author-section">
                <div className="comment-avatar">
                  <img
                    src={
                      comment.user.avatar ||
                      "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="
                    }
                    alt="avatar"
                  />
                </div>
                <span className="comment-author">
                  {comment.user.firstName + " " + comment.user.lastName}
                </span>
                {/* Show depth indicator for deeply nested comments */}
                {depth > 2 && (
                  <span className="depth-indicator">Level {depth}</span>
                )}
              </div>
              <span className="comment-date">
                {convertDate(comment.createAt)}
              </span>
            </div>
            <div className="comment-content">{comment.content}</div>

            {/* Reply button - show for all comments when user is logged in and depth limit not reached */}
            {shouldShowReplyButton && (
              <div className="comment-actions">
                <button
                  className="reply-button"
                  onClick={() => toggleReplyForm(comment.id)}
                >
                  {replyStates[comment.id] ? "Hủy" : "Trả lời"}
                </button>
              </div>
            )}

            {depth >= maxDepth && isLoggedIn && (
              <div className="depth-limit-message">
                Đã đạt giới hạn độ sâu trả lời. Không thể trả lời thêm ở cấp độ
                này.
              </div>
            )}

            {/* Reply form */}
            {replyStates[comment.id] && (
              <div className="reply-form">
                <div className="reply-form-header">
                  <img
                    src={
                      comment.user.avatar ||
                      "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="
                    }
                    alt="Your avatar"
                    className="reply-form-avatar"
                  />
                  <span className="reply-to-text">
                    Trả lời <strong>@{comment.user.firstName}</strong>
                  </span>
                </div>
                <textarea
                  value={replyTexts[comment.id] || ""}
                  onChange={(e) =>
                    handleReplyTextChange(comment.id, e.target.value)
                  }
                  placeholder={`Trả lời ${comment.user.firstName}...`}
                  className="reply-textarea"
                />
                <div className="reply-form-actions">
                  <Button
                    size="small"
                    onClick={() => handleReplySubmit(comment.id)}
                    loading={replyLoadings[comment.id]}
                    disabled={!replyTexts[comment.id]?.trim()}
                    type="primary"
                  >
                    {replyLoadings[comment.id] ? "Đang gửi..." : "Trả lời"}
                  </Button>
                  <Button
                    size="small"
                    type="text"
                    onClick={() => toggleReplyForm(comment.id)}
                  >
                    Hủy
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Render replies with Facebook-style nested collapse/expand */}
        {comment.replies && comment.replies.length > 0 && (
          <div
            className={`replies-container ${
              !expandedReplies[comment.id] ? "collapsed" : "expanded"
            }`}
          >
            {/* Hide ALL replies by default, show expand button */}
            {!expandedReplies[comment.id] ? (
              <div className="facebook-replies-toggle">
                <button
                  className="facebook-show-more-btn"
                  onClick={() => toggleShowMoreReplies(comment.id)}
                >
                  <div className="toggle-line"></div>
                  <div className="toggle-content">
                    <span className="toggle-text">
                      {comment.replies.length === 1
                        ? "Xem 1 phản hồi"
                        : `Xem ${comment.replies.length} phản hồi`}
                    </span>
                  </div>
                </button>

                {/* Show preview of first reply */}
                <div className="reply-preview">
                  <img
                    src={
                      comment.replies[0].user.avatar ||
                      "https://ik.imagekit.io/dx1lgwjws/News/default-avatar.jpg?updatedAt=1716483707937"
                    }
                    alt="avatar"
                    className="preview-avatar"
                  />
                  <span className="preview-name">
                    {comment.replies[0].user.firstName}{" "}
                    {comment.replies[0].user.lastName}
                  </span>
                  <span className="preview-content">
                    {comment.replies[0].content.length > 50
                      ? comment.replies[0].content.substring(0, 50) + "..."
                      : comment.replies[0].content}
                  </span>
                </div>
              </div>
            ) : (
              <>
                {/* Show all replies when expanded */}
                {comment.replies.map((reply) =>
                  renderComment(reply, depth + 1)
                )}

                {/* Facebook-style collapse button */}
                <div className="facebook-replies-toggle">
                  <button
                    className="facebook-hide-btn"
                    onClick={() => toggleShowMoreReplies(comment.id)}
                  >
                    <div className="toggle-line"></div>
                    <div className="toggle-content">
                      <span className="toggle-text">Ẩn phản hồi</span>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  const organizedComments = organizeComments(comments);
  console.log("Organized comments:", organizedComments); // Debug log

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
              <div>
                <label htmlFor="commentText">Viết bình luận của bạn</label>
                <textarea
                  id="commentText"
                  name="commentText"
                  value={commentUser}
                  onChange={(e) => setCommentUser(e.target.value)}
                  placeholder="Chia sẻ suy nghĩ của bạn về bài viết này..."
                  required
                />
              </div>

              <Button
                id="submmitButton"
                onClick={handleSubmit}
                loading={commentLoading}
                disabled={!commentUser.trim()}
                type="primary"
              >
                {commentLoading ? "Đang xử lý..." : "Đăng bình luận"}
              </Button>
            </div>
          ) : (
            <button id="loginButton" onClick={() => navigate("/login")}>
              Đăng nhập để bình luận
            </button>
          )}

          {/* Render main comments with Facebook-style layout */}
          <div className="comments-container">
            {organizedComments.length > 0 ? (
              <>
                {/* Show initial comments or all comments based on showMore state */}
                {(showMoreComments
                  ? organizedComments
                  : organizedComments.slice(0, INITIAL_COMMENTS_SHOW)
                ).map((comment) => renderComment(comment, 0))}

                {/* Show More/Less Comments Button */}
                {organizedComments.length > INITIAL_COMMENTS_SHOW && (
                  <div className="main-comments-toggle">
                    <button
                      className="show-more-main-comments-btn"
                      onClick={toggleShowMoreComments}
                    >
                      <div className="main-toggle-content">
                        <span className="main-toggle-icon">
                          {showMoreComments ? "▲" : "▼"}
                        </span>
                        <span className="main-toggle-text">
                          {showMoreComments
                            ? "Ẩn bớt bình luận"
                            : `Xem thêm ${
                                organizedComments.length - INITIAL_COMMENTS_SHOW
                              } bình luận`}
                        </span>
                        <div className="comments-count-badge">
                          {organizedComments.length}
                        </div>
                      </div>
                    </button>

                    {/* Preview of next main comment */}
                    {!showMoreComments &&
                      organizedComments[INITIAL_COMMENTS_SHOW] && (
                        <div className="main-comment-preview">
                          <img
                            src={
                              organizedComments[INITIAL_COMMENTS_SHOW].user
                                .avatar ||
                              "https://ik.imagekit.io/dx1lgwjws/News/default-avatar.jpg?updatedAt=1716483707937"
                            }
                            alt="avatar"
                            className="main-preview-avatar"
                          />
                          <div className="main-preview-content">
                            <span className="main-preview-name">
                              {
                                organizedComments[INITIAL_COMMENTS_SHOW].user
                                  .firstName
                              }{" "}
                              {
                                organizedComments[INITIAL_COMMENTS_SHOW].user
                                  .lastName
                              }
                            </span>
                            <span className="main-preview-text">
                              {organizedComments[INITIAL_COMMENTS_SHOW].content
                                .length > 80
                                ? organizedComments[
                                    INITIAL_COMMENTS_SHOW
                                  ].content.substring(0, 80) + "..."
                                : organizedComments[INITIAL_COMMENTS_SHOW]
                                    .content}
                            </span>
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  color: "#6b7280",
                  fontStyle: "italic",
                  padding: "3rem",
                  background: "white",
                  borderRadius: "20px",
                  fontSize: "1.2rem",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
                  border: "2px dashed #e5e7eb",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    fontSize: "3rem",
                    marginBottom: "1rem",
                    opacity: "0.5",
                  }}
                >
                  💭
                </div>
                Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ suy nghĩ
                của bạn!
              </div>
            )}
          </div>
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
