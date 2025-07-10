import React, { useEffect, useState } from 'react';
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
  MenuItem, 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import api from '../../../services/mockApi';

const PostsAD = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State cho dialog chỉnh sửa
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editFormData, setEditFormData] = useState({ title: '', content: '', author: '', category: '', views: 0 });

  // State cho dialog thêm mới
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [addFormData, setAddFormData] = useState({ title: '', content: '', author: '', category: '', views: 0 });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/posts');
        setPosts(response.data);
      } catch (err) {
        setError('Không thể tải danh sách bài viết. Lỗi: ' + (err.message || 'Không rõ nguyên nhân. Vui lòng kiểm tra console.'));
        console.error("Lỗi khi tải bài viết:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // --- Logic cho Chỉnh sửa Bài viết ---
  const handleEditClick = (post) => {
    setEditingPost(post);
    setEditFormData({
      title: post.title,
      content: post.content,
      author: post.author,
      category: post.category,
      views: post.views,
    });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditingPost(null);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: name === 'views' ? Number(value) : value });
  };

  const handleSaveEdit = async () => {
    if (!editingPost) return;

    try {
      setLoading(true);
      const response = await api.put(`/posts/${editingPost.id}`, {
        ...editingPost,
        title: editFormData.title,
        content: editFormData.content,
        author: editFormData.author,
        category: editFormData.category,
        views: editFormData.views,
      });

      setPosts(posts.map(p => (p.id === editingPost.id ? response.data : p)));
      handleCloseEditDialog();
      alert('Bài viết đã được cập nhật thành công!');
    } catch (err) {
      alert('Không thể cập nhật bài viết. Lỗi: ' + (err.message || 'Không rõ'));
      console.error("Lỗi khi cập nhật bài viết:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- Logic cho Thêm Bài viết Mới ---
  const handleAddClick = () => {
    setAddFormData({ title: '', content: '', author: '', category: '', views: 0 }); // Reset form khi mở
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleAddFormChange = (e) => {
    const { name, value } = e.target;
    setAddFormData({ ...addFormData, [name]: name === 'views' ? Number(value) : value });
  };

  const handleSaveAdd = async () => {
    try {
      setLoading(true);
      // Gọi API POST để thêm bài viết mới
      const response = await api.post('/posts', addFormData);
      setPosts([...posts, response.data]); // Thêm bài viết mới vào danh sách hiện có
      handleCloseAddDialog(); // Đóng dialog
      alert('Bài viết đã được thêm thành công!');
    } catch (err) {
      alert('Không thể thêm bài viết. Lỗi: ' + (err.message || 'Không rõ'));
      console.error("Lỗi khi thêm bài viết:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- Logic cho Xóa Bài viết ---
  const handleDeletePost = async (postId) => {
    if (window.confirm(`Bạn có chắc muốn xóa bài viết có ID: ${postId}?`)) {
      try {
        setLoading(true);
        await api.delete(`/posts/${postId}`);
        setPosts(posts.filter(post => post.id !== postId));
        alert('Bài viết đã được xóa thành công!');
      } catch (err) {
        alert('Không thể xóa bài viết. Lỗi: ' + (err.message || 'Không rõ'));
        console.error("Lỗi khi xóa bài viết:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Đang tải danh sách bài viết...</Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Quản lý Bài viết
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        sx={{ mb: 2 }}
        onClick={handleAddClick} // Gọi hàm handleAddClick để mở dialog thêm
      >
        Thêm Bài viết
      </Button>
      {posts.length === 0 ? (
        <Typography>Không có bài viết nào để hiển thị.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tiêu đề</TableCell>
                <TableCell>Tác giả</TableCell>
                <TableCell>Thể loại</TableCell>
                <TableCell align="right">Lượt xem</TableCell>
                <TableCell align="center">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>{post.id}</TableCell>
                  <TableCell>{post.title}</TableCell>
                  <TableCell>{post.author}</TableCell>
                  <TableCell>{post.category}</TableCell>
                  <TableCell align="right">{post.views}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleEditClick(post)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeletePost(post.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog chỉnh sửa bài viết */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Chỉnh sửa bài viết</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Tiêu đề"
            type="text"
            fullWidth
            variant="standard"
            value={editFormData.title}
            onChange={handleEditFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="content"
            label="Nội dung"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="standard"
            value={editFormData.content}
            onChange={handleEditFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="author"
            label="Tác giả"
            type="text"
            fullWidth
            variant="standard"
            value={editFormData.author}
            onChange={handleEditFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="category"
            label="Thể loại"
            type="text"
            fullWidth
            variant="standard"
            value={editFormData.category}
            onChange={handleEditFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="views"
            label="Lượt xem"
            type="number"
            fullWidth
            variant="standard"
            value={editFormData.views}
            onChange={handleEditFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Hủy</Button>
          <Button onClick={handleSaveEdit}>Lưu</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog THÊM MỚI bài viết */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>Thêm bài viết mới</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Tiêu đề"
            type="text"
            fullWidth
            variant="standard"
            value={addFormData.title}
            onChange={handleAddFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="content"
            label="Nội dung"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="standard"
            value={addFormData.content}
            onChange={handleAddFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="author"
            label="Tác giả"
            type="text"
            fullWidth
            variant="standard"
            value={addFormData.author}
            onChange={handleAddFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="category"
            label="Thể loại"
            type="text"
            fullWidth
            variant="standard"
            value={addFormData.category}
            onChange={handleAddFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="views"
            label="Lượt xem"
            type="number"
            fullWidth
            variant="standard"
            value={addFormData.views}
            onChange={handleAddFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Hủy</Button>
          <Button onClick={handleSaveAdd}>Thêm</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PostsAD;