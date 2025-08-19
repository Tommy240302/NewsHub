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
    FormControlLabel,
    Checkbox,
    Chip,
    InputAdornment,
    TablePagination,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import apiClient from '../../../api/apiClient';

const UsersAD = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [editFormData, setEditFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        isEnabled: true,
        phone: '',
        avatar: '',
        roleNames: [],
    });

    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [addFormData, setAddFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        isEnabled: true,
        phone: '',
        avatar: '',
        roleNames: ['READER'],
    });

    // States cho phân trang
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalElements, setTotalElements] = useState(0);

    const fetchUsers = async (pageNumber = 0, pageSize = rowsPerPage, currentSearchTerm = searchTerm) => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiClient.get('/admin/users', {
                params: {
                    searchTerm: currentSearchTerm,
                    page: pageNumber,
                    size: pageSize,
                }
            });

            if (response.data && Array.isArray(response.data.content)) {
                setUsers(response.data.content);
                setTotalElements(response.data.totalElements);
            } else {
                const errorMessage = 'Cấu trúc dữ liệu trả về từ backend không hợp lệ hoặc thiếu trường "content".';
                setError(errorMessage);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Không rõ nguyên nhân.';
            setError('Không thể tải danh sách người dùng. Lỗi: ' + errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(page, rowsPerPage);
    }, [page, rowsPerPage]);

    const handleEditClick = (user) => {
        setEditingUser(user);
        setEditFormData({
            email: user.email,
            password: '',
            firstName: user.firstName,
            lastName: user.lastName,
            dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
            isEnabled: user.isEnabled,
            phone: user.phone,
            avatar: user.avatar,
            roleNames: Array.isArray(user.roles) ? user.roles : [],
        });
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setEditingUser(null);
    };

    const handleEditFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditFormData({
            ...editFormData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleRoleChange = (event) => {
        const rolesInput = event.target.value;
        const rolesArray = rolesInput.split(',').map(role => role.trim()).filter(role => role !== '');
        setEditFormData({
            ...editFormData,
            roleNames: rolesArray,
        });
    };

    const handleSaveEdit = async () => {
        if (!editingUser) return;
        try {
            setLoading(true);
            const payload = { ...editFormData };

            if (payload.password === '') {
                delete payload.password;
            }

            if (payload.roleNames && Array.isArray(payload.roleNames)) {
                payload.roleNames = Array.from(new Set(payload.roleNames));
            } else {
                payload.roleNames = [];
            }

            if (payload.dateOfBirth) {
                payload.dateOfBirth = new Date(payload.dateOfBirth);
            } else {
                payload.dateOfBirth = null;
            }

            const response = await apiClient.put(`/admin/users/${editingUser.id}`, payload);
            if (response.data) {
                fetchUsers(page, rowsPerPage);
                handleCloseEditDialog();
                alert('Người dùng đã được cập nhật thành công!');
            } else {
                alert('Không thể cập nhật người dùng. Phản hồi trống hoặc không mong muốn.');
            }
        } catch (err) {
            alert('Không thể cập nhật người dùng. Lỗi: ' + (err.response?.data?.message || err.message || 'Không rõ'));
        } finally {
            setLoading(false);
        }
    };

    const handleAddClick = () => {
        setAddFormData({
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            isEnabled: true,
            phone: '',
            avatar: '',
            roleNames: ['READER'],
        });
        setOpenAddDialog(true);
    };

    const handleCloseAddDialog = () => {
        setOpenAddDialog(false);
    };

    const handleAddFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAddFormData({
            ...addFormData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleAddRoleChange = (event) => {
        const rolesInput = event.target.value;
        const rolesArray = rolesInput.split(',').map(role => role.trim()).filter(role => role !== '');
        setAddFormData({
            ...addFormData,
            roleNames: rolesArray,
        });
    };

    const handleSaveAdd = async () => {
        try {
            setLoading(true);
            const payload = { ...addFormData };

            if (payload.roleNames && Array.isArray(payload.roleNames)) {
                payload.roleNames = Array.from(new Set(payload.roleNames));
            } else {
                payload.roleNames = ['READER'];
            }

            if (payload.dateOfBirth) {
                payload.dateOfBirth = new Date(payload.dateOfBirth);
            } else {
                payload.dateOfBirth = null;
            }

            const response = await apiClient.post('/admin/users', payload);
            if (response.data) {
                fetchUsers(page, rowsPerPage);
                handleCloseAddDialog();
                alert('Người dùng đã được thêm thành công!');
            } else {
                alert('Không thể thêm người dùng. Phản hồi trống hoặc không mong muốn.');
            }
        } catch (err) {
            alert('Không thể thêm người dùng. Lỗi: ' + (err.response?.data?.message || err.message || 'Không rõ'));
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm(`Bạn có chắc muốn xóa người dùng có ID: ${userId}? (Thực hiện xóa mềm)`)) {
            try {
                setLoading(true);
                const response = await apiClient.delete(`/admin/users/${userId}`);

                if (response.status === 200 || response.status === 204) {
                    fetchUsers(page, rowsPerPage);
                    alert('Người dùng đã được xóa mềm thành công!');
                } else {
                    alert('Không thể xóa người dùng. Lỗi: ' + (response.data?.message || 'Không rõ'));
                }
            } catch (err) {
                alert('Không thể xóa người dùng. Lỗi: ' + (err.response?.data?.message || err.message || 'Không rõ'));
            } finally {
                setLoading(false);
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return '';
        }
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('vi-VN', options);
    };

    const handleSearchInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = () => {
        setPage(0); // Reset trang về 0 khi tìm kiếm mới
        fetchUsers(0, rowsPerPage, searchTerm);
    };

    // Hàm xử lý thay đổi trang
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Hàm xử lý thay đổi số lượng hàng trên mỗi trang
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset trang về 0 khi thay đổi số hàng
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
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleAddClick}
                >
                    Thêm Người dùng
                </Button>
                <TextField
                    label="Tìm kiếm người dùng"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={handleSearchInputChange}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
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
                    sx={{ width: '300px' }}
                />
                <Button variant="contained" onClick={handleSearchSubmit}>Tìm kiếm</Button>
            </Box>

            {users.length === 0 ? (
                <Typography>Không có người dùng nào để hiển thị.</Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Họ</TableCell>
                                <TableCell>Tên</TableCell>
                                <TableCell>Ngày sinh</TableCell>
                                <TableCell>Số điện thoại</TableCell>
                                <TableCell>Trạng thái</TableCell>
                                <TableCell>Vai trò</TableCell>
                                <TableCell align="center">Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.firstName}</TableCell>
                                    <TableCell>{user.lastName}</TableCell>
                                    <TableCell>{formatDate(user.dateOfBirth)}</TableCell>
                                    <TableCell>{user.phone}</TableCell>
                                    <TableCell>
                                        {user.isEnabled ? (
                                            <Chip label="Hoạt động" color="success" size="small" />
                                        ) : (
                                            <Chip label="Không hoạt động" color="error" size="small" />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {user.roles && Array.isArray(user.roles) && user.roles.map((role, index) => (
                                            <Chip key={index} label={role} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                                        ))}
                                    </TableCell>
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
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={totalElements}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Số hàng mỗi trang:"
                        labelDisplayedRows={({ from, to, count }) =>
                            `Hiển thị ${from}–${to} trên tổng số ${count}`
                        }
                    />
                </TableContainer>
            )}

            <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
                <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="email"
                        label="Email"
                        type="email"
                        fullWidth
                        variant="standard"
                        value={editFormData.email}
                        onChange={handleEditFormChange}
                        sx={{ mb: 2 }}
                        disabled
                    />
                    <TextField
                        margin="dense"
                        name="password"
                        label="Mật khẩu (Để trống nếu không đổi)"
                        type="password"
                        fullWidth
                        variant="standard"
                        value={editFormData.password}
                        onChange={handleEditFormChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        name="firstName"
                        label="Họ"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={editFormData.firstName}
                        onChange={handleEditFormChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        name="lastName"
                        label="Tên"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={editFormData.lastName}
                        onChange={handleEditFormChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        name="dateOfBirth"
                        label="Ngày sinh"
                        type="date"
                        fullWidth
                        variant="standard"
                        value={editFormData.dateOfBirth}
                        onChange={handleEditFormChange}
                        InputLabelProps={{ shrink: true }}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        name="phone"
                        label="Số điện thoại"
                        type="tel"
                        fullWidth
                        variant="standard"
                        value={editFormData.phone}
                        onChange={handleEditFormChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        name="avatar"
                        label="URL Avatar"
                        type="url"
                        fullWidth
                        variant="standard"
                        value={editFormData.avatar}
                        onChange={handleEditFormChange}
                        sx={{ mb: 2 }}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={editFormData.isEnabled}
                                onChange={handleEditFormChange}
                                name="isEnabled"
                            />
                        }
                        label="Kích hoạt tài khoản"
                        sx={{ mb: 1 }}
                    />
                    <TextField
                        margin="dense"
                        name="roleNames"
                        label="Vai trò (phân tách bởi dấu phẩy, VD: READER,AUTHOR)"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={Array.isArray(editFormData.roleNames) ? editFormData.roleNames.join(', ') : ''}
                        onChange={handleRoleChange}
                        sx={{ mb: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditDialog}>Hủy</Button>
                    <Button onClick={handleSaveEdit}>Lưu</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
                <DialogTitle>Thêm người dùng mới</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
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
                        name="password"
                        label="Mật khẩu"
                        type="password"
                        fullWidth
                        variant="standard"
                        value={addFormData.password}
                        onChange={handleAddFormChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        name="firstName"
                        label="Họ"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={addFormData.firstName}
                        onChange={handleAddFormChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        name="lastName"
                        label="Tên"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={addFormData.lastName}
                        onChange={handleAddFormChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        name="dateOfBirth"
                        label="Ngày sinh"
                        type="date"
                        fullWidth
                        variant="standard"
                        value={addFormData.dateOfBirth}
                        onChange={handleAddFormChange}
                        InputLabelProps={{ shrink: true }}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        name="phone"
                        label="Số điện thoại"
                        type="tel"
                        fullWidth
                        variant="standard"
                        value={addFormData.phone}
                        onChange={handleAddFormChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        name="avatar"
                        label="URL Avatar"
                        type="url"
                        fullWidth
                        variant="standard"
                        value={addFormData.avatar}
                        onChange={handleAddFormChange}
                        sx={{ mb: 2 }}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={addFormData.isEnabled}
                                onChange={handleAddFormChange}
                                name="isEnabled"
                            />
                        }
                        label="Kích hoạt tài khoản"
                        sx={{ mb: 1 }}
                    />
                    <TextField
                        margin="dense"
                        name="roleNames"
                        label="Vai trò (phân tách bởi dấu phẩy, VD: READER,AUTHOR)"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={Array.isArray(addFormData.roleNames) ? addFormData.roleNames.join(', ') : ''}
                        onChange={handleAddRoleChange}
                        sx={{ mb: 2 }}
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
