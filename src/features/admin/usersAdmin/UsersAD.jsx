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
  MenuItem, // Thêm MenuItem cho vai trò
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import api from '../../../services/mockApi';

const UsersAD = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State cho dialog chỉnh sửa
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({ username: '', email: '', role: '' });

  // State cho dialog thêm mới
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [addFormData, setAddFormData] = useState({ username: '', email: '', role: 'user' }); // Mặc định role là 'user'

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await api.get('/users');
        setUsers(response.data);
      } catch (err) {
        setError('Không thể tải danh sách người dùng. Lỗi: ' + (err.message || 'Không rõ nguyên nhân. Vui lòng kiểm tra console.'));
        console.error("Lỗi khi tải người dùng:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // --- Logic cho Chỉnh sửa Người dùng ---
  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditFormData({ username: user.username, email: user.email, role: user.role });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditingUser(null);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;

    try {
      setLoading(true);
      const response = await api.put(`/users/${editingUser.id}`, {
        ...editingUser,
        username: editFormData.username,
        email: editFormData.email,
        role: editFormData.role,
      });

      setUsers(users.map(u => (u.id === editingUser.id ? response.data : u)));
      handleCloseEditDialog();
      alert('Người dùng đã được cập nhật thành công!');
    } catch (err) {
      alert('Không thể cập nhật người dùng. Lỗi: ' + (err.message || 'Không rõ'));
      console.error("Lỗi khi cập nhật người dùng:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- Logic cho Thêm Người dùng Mới ---
  const handleAddClick = () => {
    setAddFormData({ username: '', email: '', role: 'user' }); // Reset form khi mở
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleAddFormChange = (e) => {
    const { name, value } = e.target;
    setAddFormData({ ...addFormData, [name]: value });
  };

  const handleSaveAdd = async () => {
    try {
      setLoading(true);
      // Gọi API POST để thêm người dùng mới
      const response = await api.post('/users', addFormData);
      setUsers([...users, response.data]); // Thêm người dùng mới vào danh sách hiện có
      handleCloseAddDialog(); // Đóng dialog
      alert('Người dùng đã được thêm thành công!');
    } catch (err) {
      alert('Không thể thêm người dùng. Lỗi: ' + (err.message || 'Không rõ'));
      console.error("Lỗi khi thêm người dùng:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- Logic cho Xóa Người dùng ---
  const handleDeleteUser = async (userId) => {
    if (window.confirm(`Bạn có chắc muốn xóa người dùng có ID: ${userId}?`)) {
      try {
        setLoading(true);
        await api.delete(`/users/${userId}`);
        setUsers(users.filter(user => user.id !== userId));
        alert('Người dùng đã được xóa thành công!');
      } catch (err) {
        alert('Không thể xóa người dùng. Lỗi: ' + (err.message || 'Không rõ'));
        console.error("Lỗi khi xóa người dùng:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Đang tải danh sách người dùng...</Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Quản lý Người dùng
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        sx={{ mb: 2 }}
        onClick={handleAddClick} // Gọi hàm handleAddClick để mở dialog thêm
      >
        Thêm Người dùng
      </Button>
      {users.length === 0 ? (
        <Typography>Không có người dùng nào để hiển thị.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tên đăng nhập</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Vai trò</TableCell>
                <TableCell align="center">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleEditClick(user)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteUser(user.id)}
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

      {/* Dialog chỉnh sửa người dùng */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="username"
            label="Tên đăng nhập"
            type="text"
            fullWidth
            variant="standard"
            value={editFormData.username}
            onChange={handleEditFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            value={editFormData.email}
            onChange={handleEditFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="role"
            label="Vai trò"
            select // Sử dụng select cho vai trò
            fullWidth
            variant="standard"
            value={editFormData.role}
            onChange={handleEditFormChange}
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="editor">Editor</MenuItem>
            <MenuItem value="author">Author</MenuItem>
            <MenuItem value="user">User</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Hủy</Button>
          <Button onClick={handleSaveEdit}>Lưu</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog THÊM MỚI người dùng */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>Thêm người dùng mới</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="username"
            label="Tên đăng nhập"
            type="text"
            fullWidth
            variant="standard"
            value={addFormData.username}
            onChange={handleAddFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            value={addFormData.email}
            onChange={handleAddFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="role"
            label="Vai trò"
            select 
            fullWidth
            variant="standard"
            value={addFormData.role}
            onChange={handleAddFormChange}
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="editor">Editor</MenuItem>
            <MenuItem value="author">Author</MenuItem>
            <MenuItem value="user">User</MenuItem>
          </TextField>
          
          <TextField
            margin="dense"
            name="password"
            label="Mật khẩu (mặc định)"
            type="text"
            fullWidth
            variant="standard"
            value={addFormData.password || 'default_password'}
            onChange={handleAddFormChange}
            helperText="Mật khẩu mặc định nếu không nhập"
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

export default UsersAD;