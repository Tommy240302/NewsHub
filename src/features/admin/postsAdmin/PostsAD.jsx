import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Pagination,
  Chip,
} from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import apiClient from "../../../api/apiClient";

const PostsAD = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [pendingPosts, setPendingPosts] = useState([]);
  const [loadingAll, setLoadingAll] = useState(true);
  const [loadingPending, setLoadingPending] = useState(true);
  const [errorAll, setErrorAll] = useState(null);
  const [errorPending, setErrorPending] = useState(null);
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [previewContent, setPreviewContent] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const [conflictDialogOpen, setConflictDialogOpen] = useState(false);
  const [selectedConflictPost, setSelectedConflictPost] = useState(null);
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [aiCategory, setAiCategory] = useState({
    id: -1,
    content: "",
  });
  const [humanCategory, setHumanCategory] = useState({
    id: -1,
    content: "",
  });

  const handleLabelConflict = (post) => {
    const aiLabel = post.categories.find(
      (category) => category.dataType === "AI"
    );
    const humanLabel = post.categories.find(
      (category) => category.dataType === "HUMAN"
    );

    setSelectedConflictPost(post);

    // Set categories here, not in render
    if (aiLabel) {
      setAiCategory({
        id: aiLabel.id,
        content: aiLabel.category.content,
      });
    }

    if (humanLabel) {
      setHumanCategory({
        id: humanLabel.id,
        content: humanLabel.category.content,
      });
    }

    setSelectedLabel(null);
    setConflictDialogOpen(true);
  };

  const handleResolveConflict = async () => {
    if (!selectedConflictPost || !selectedLabel) return;

    try {
      const finalLabel =
        selectedLabel === "ai" ? aiCategory.id : humanCategory.id;

      const response = await apiClient.patch(
        "admin/news/resolve/" + finalLabel
      );

      console.log(
        "Resolved conflict for post:",
        selectedConflictPost.id,
        "with label id:",
        finalLabel
      );
      setConflictDialogOpen(false);
      setSelectedConflictPost(null);
      setSelectedLabel(null);
      fetchPendingPosts();
    } catch (error) {
      console.error("Error resolving conflict:", error);
    }
  };

  const fetchAllPosts = async (
    currentSearchTerm = searchTerm,
    page = currentPage
  ) => {
    try {
      setLoadingAll(true);
      setErrorAll(null);
      const response = await apiClient.get("/admin/news", {
        params: {
          searchTerm: currentSearchTerm,
          page: page,
          size: pageSize,
        },
      });

      if (response.data && Array.isArray(response.data.content)) {
        setAllPosts(response.data.content);
        setTotalPages(response.data.totalPages);
      } else {
        setErrorAll(
          "Cấu trúc dữ liệu trả về từ backend không hợp lệ cho tất cả bài viết."
        );
      }
    } catch (err) {
      setErrorAll(
        "Không thể tải danh sách tất cả bài viết. Lỗi: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoadingAll(false);
    }
  };

  const fetchPendingPosts = async () => {
    try {
      setLoadingPending(true);
      setErrorPending(null);

      const response = await apiClient.get("/admin/news/pending");
      if (response.data && Array.isArray(response.data.data)) {
        setPendingPosts(response.data.data);
      } else {
        setErrorPending(
          "Cấu trúc dữ liệu trả về từ backend không hợp lệ cho bài viết chờ duyệt."
        );
      }
    } catch (err) {
      setErrorPending(
        "Không thể tải danh sách bài viết chờ duyệt. Lỗi: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoadingPending(false);
    }
  };

  useEffect(() => {
    fetchAllPosts();
    fetchPendingPosts();
  }, []);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleApprovePost = async (postId) => {
    if (window.confirm(`Bạn có chắc muốn duyệt bài viết có ID: ${postId}?`)) {
      try {
        setLoadingPending(true);
        const response = await apiClient.put(`/admin/news/${postId}/approve`);
        if (response.data && response.data.status === "Success") {
          alert("Bài viết đã được duyệt thành công!");
          fetchAllPosts();
          fetchPendingPosts();
        } else {
          alert(
            "Không thể duyệt bài viết. Lỗi: " +
              (response.data?.errorMessage || "Không rõ")
          );
        }
      } catch (err) {
        alert(
          "Không thể duyệt bài viết. Lỗi: " +
            (err.response?.data?.message || err.message || "Không rõ")
        );
      } finally {
        setLoadingPending(false);
      }
    }
  };

  const handleSoftDeletePost = async (postId) => {
    if (window.confirm(`Bạn có chắc muốn xóa bài viết có ID: ${postId}?`)) {
      try {
        setLoadingPending(true);
        setLoadingAll(true);
        const response = await apiClient.delete(`/admin/news/${postId}`);
        if (
          response.status === 204 ||
          (response.data && response.data.status === "Success")
        ) {
          alert("Bài viết đã được xóa mềm thành công!");
          fetchAllPosts();
          fetchPendingPosts();
        } else {
          alert(
            "Không thể xóa bài viết. Lỗi: " +
              (response.data?.message || "Không rõ")
          );
        }
      } catch (err) {
        alert(
          "Không thể xóa bài viết. Lỗi: " +
            (err.response?.data?.message || err.message || "Không rõ")
        );
      } finally {
        setLoadingPending(false);
        setLoadingAll(false);
      }
    }
  };

  const handlePreviewPost = (content, title) => {
    setPreviewContent(content);
    setPreviewTitle(title);
    setIsPreviewVisible(true);
  };

  const handleClosePreviewDialog = () => {
    setIsPreviewVisible(false);
    setPreviewContent("");
    setPreviewTitle("");
  };

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = () => {
    setCurrentPage(0);
    fetchAllPosts(searchTerm, 0);
  };

  const handlePageChange = (event, pageNumber) => {
    setCurrentPage(pageNumber - 1);
    fetchAllPosts(searchTerm, pageNumber - 1);
  };

  if (loadingAll || loadingPending) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Đang tải danh sách bài viết...</Typography>
      </Box>
    );
  }

  if (errorAll && errorPending) {
    return (
      <Alert severity="error">
        Lỗi khi tải dữ liệu: {errorAll} và {errorPending}
      </Alert>
    );
  } else if (errorAll) {
    return (
      <Alert severity="error">Lỗi khi tải tất cả bài viết: {errorAll}</Alert>
    );
  } else if (errorPending) {
    return (
      <Alert severity="error">
        Lỗi khi tải bài viết chờ duyệt: {errorPending}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Quản lý Bài viết
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          aria-label="quản lý bài viết tabs"
        >
          <Tab label="Tất cả Bài viết" value="all" />
          <Tab label="Bài viết chờ duyệt" value="pending" />
        </Tabs>
      </Box>

      {selectedTab === "all" && (
        <Box sx={{ pt: 2 }}>
          <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 2 }}>
            <TextField
              label="Tìm kiếm theo tiêu đề"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearchInputChange}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSearchSubmit();
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSearchSubmit} edge="end">
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ width: "300px" }}
            />
            <Button variant="contained" onClick={handleSearchSubmit}>
              Tìm kiếm
            </Button>
          </Box>

          {allPosts.length === 0 ? (
            <Typography>Không có bài viết nào để hiển thị.</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Tiêu đề</TableCell>
                    <TableCell>Tác giả</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell>Lượt xem</TableCell>
                    <TableCell>Ngày tạo</TableCell>
                    <TableCell>Ngày xuất bản</TableCell>
                    <TableCell align="center">Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>{post.id}</TableCell>
                      <TableCell>{post.title}</TableCell>
                      <TableCell>{post.authorName}</TableCell>
                      <TableCell>
                        {post.status ? "Đã duyệt" : "Chờ duyệt"}
                      </TableCell>
                      <TableCell>
                        {post.views ? post.views.toLocaleString("vi-VN") : "0"}
                      </TableCell>
                      <TableCell>
                        {post.createdAt
                          ? new Date(post.createdAt).toLocaleDateString("vi-VN")
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString(
                              "vi-VN"
                            )
                          : "N/A"}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleSoftDeletePost(post.id)}
                          title="Xóa bài viết"
                        >
                          <DeleteIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() =>
                            handlePreviewPost(post.content, post.title)
                          }
                          title="Xem trước nội dung"
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 2 }}>
            <Pagination
              count={totalPages}
              page={currentPage + 1}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </Box>
      )}

      {selectedTab === "pending" && (
        <Box sx={{ pt: 2 }}>
          {pendingPosts.length === 0 ? (
            <Typography>Không có bài viết nào đang chờ duyệt.</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Tiêu đề</TableCell>
                    <TableCell>Tác giả</TableCell>
                    <TableCell>Ngày tạo</TableCell>
                    <TableCell>Kết quả nhãn</TableCell>
                    <TableCell align="center">Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingPosts.map((post) => {
                    const aiLabel = post.categories.find(
                      (category) => category.dataType == "AI"
                    );
                    const humanLabel = post.categories.find(
                      (category) => category.dataType == "HUMAN"
                    );

                    const isConflict =
                      aiLabel &&
                      humanLabel &&
                      aiLabel.category.content !==
                        humanLabel.category.content &&
                      !aiLabel.selected &&
                      !humanLabel.selected;
                    return (
                      <TableRow key={post.id}>
                        <TableCell>{post.id}</TableCell>
                        <TableCell>{post.title}</TableCell>
                        <TableCell>{post.authorName}</TableCell>
                        <TableCell>
                          {post.createdAt
                            ? new Date(post.createdAt).toLocaleDateString(
                                "vi-VN"
                              )
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          {isConflict ? (
                            <Chip
                              label="Conflict"
                              color="error"
                              size="small"
                              onClick={() => handleLabelConflict(post)}
                              sx={{ cursor: "pointer" }}
                            />
                          ) : (
                            <Chip
                              label={
                                aiLabel?.selected
                                  ? aiLabel.category.content
                                  : humanLabel?.selected
                                  ? humanLabel.category.content
                                  : "N/A"
                              }
                              color="success"
                              size="small"
                            />
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleApprovePost(post.id)}
                            disabled={
                              post.isDeleted || post.status || isConflict
                            }
                            title="Duyệt bài viết"
                          >
                            <CheckIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="warning"
                            onClick={() => handleSoftDeletePost(post.id)}
                            disabled={post.isDeleted || post.status}
                            title="Từ chối (Xóa mềm)"
                          >
                            <CloseIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() =>
                              handlePreviewPost(post.content, post.title)
                            }
                            title="Xem trước nội dung"
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <Dialog
            open={conflictDialogOpen}
            onClose={() => setConflictDialogOpen(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Giải quyết xung đột nhãn</DialogTitle>
            <DialogContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Bài viết: <strong>{selectedConflictPost?.title}</strong>
              </Typography>
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
              >
                <Paper
                  elevation={selectedLabel === "ai" ? 3 : 1}
                  sx={{
                    p: 2,
                    cursor: "pointer",
                    border: selectedLabel === "ai" ? "2px solid" : "1px solid",
                    borderColor:
                      selectedLabel === "ai" ? "primary.main" : "divider",
                    transition: "all 0.2s",
                  }}
                  onClick={() => setSelectedLabel("ai")}
                >
                  <Typography variant="subtitle2" color="primary">
                    🤖 Nhãn từ AI/Model
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    {aiCategory.content || "N/A"}
                  </Typography>
                </Paper>

                <Paper
                  elevation={selectedLabel === "human" ? 3 : 1}
                  sx={{
                    p: 2,
                    cursor: "pointer",
                    border:
                      selectedLabel === "human" ? "2px solid" : "1px solid",
                    borderColor:
                      selectedLabel === "human" ? "secondary.main" : "divider",
                    transition: "all 0.2s",
                  }}
                  onClick={() => setSelectedLabel("human")}
                >
                  <Typography variant="subtitle2" color="secondary">
                    👤 Nhãn từ Người dùng
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    {humanCategory.content || "N/A"}
                  </Typography>
                </Paper>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setConflictDialogOpen(false)}>Hủy</Button>
              <Button
                onClick={handleResolveConflict}
                variant="contained"
                disabled={!selectedLabel}
              >
                Xác nhận chọn
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}

      <Dialog
        open={isPreviewVisible}
        onClose={handleClosePreviewDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{previewTitle}</DialogTitle>
        <DialogContent dividers>
          <div dangerouslySetInnerHTML={{ __html: previewContent }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreviewDialog}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PostsAD;
