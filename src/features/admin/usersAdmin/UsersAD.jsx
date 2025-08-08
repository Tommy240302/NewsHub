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
    FormControlLabel, // Thêm FormControlLabel cho Checkbox
    Checkbox, // Thêm Checkbox
    Chip, // Thêm Chip để hiển thị vai trò
    InputAdornment, // <-- Thêm InputAdornment cho icon tìm kiếm
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search'; // <-- Thêm SearchIcon
import apiClient from '../../../api/apiClient'; // Đảm bảo đường dẫn này đúng

const UsersAD = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // <-- State cho từ khóa tìm kiếm

    // State cho dialog chỉnh sửa
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [editFormData, setEditFormData] = useState({
        email: '',
        password: '', // Không hiển thị mật khẩu hiện tại, yêu cầu nhập lại nếu muốn đổi
        firstName: '',
        lastName: '',
        dateOfBirth: '', // Định dạng YYYY-MM-DD cho input type="date"
        isEnabled: true,
        phone: '',
        avatar: '',
        roleNames: [], // Mảng các string role names
    });

    // State cho dialog thêm mới
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [addFormData, setAddFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '', // Định dạng YYYY-MM-DD cho input type="date"
        isEnabled: true,
        phone: '',
        avatar: '',
        roleNames: ['USER'], // Mặc định gán vai trò 'USER' khi thêm mới
    });

    // Hàm để tải danh sách người dùng từ backend, có hỗ trợ tìm kiếm
    const fetchUsers = async (currentSearchTerm = searchTerm) => { // <-- Thêm tham số
        console.log("UsersAD: Bắt đầu gọi fetchUsers...");
        try {
            setLoading(true);
            setError(null);

            // Gọi API GET /admin/users với tham số tìm kiếm
            const response = await apiClient.get('/admin/users', {
                params: {
                    searchTerm: currentSearchTerm, // <-- Gửi searchTerm
                }
            });
            console.log("UsersAD: Phản hồi từ API GET /admin/users:", response.data);

            if (response.data && Array.isArray(response.data.content)) {
                setUsers(response.data.content);
                console.log("UsersAD: Dữ liệu người dùng đã tải thành công:", response.data.content);
            } else {
                const errorMessage = 'Cấu trúc dữ liệu trả về từ backend không hợp lệ hoặc thiếu trường "content".';
                setError(errorMessage);
                console.error("UsersAD: Cấu trúc dữ liệu backend không đúng định dạng:", response.data);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Không rõ nguyên nhân.';
            setError('Không thể tải danh sách người dùng. Lỗi: ' + errorMessage);
            console.error("UsersAD: Lỗi khi tải người dùng (catch block):", err);
        } finally {
            setLoading(false);
            console.log("UsersAD: Kết thúc fetchUsers.");
        }
    };

    useEffect(() => {
        fetchUsers(); // Gọi lần đầu không có searchTerm (hoặc searchTerm rỗng)
    }, []);

    // --- Logic cho Chỉnh sửa Người dùng ---
    const handleEditClick = (user) => {
        setEditingUser(user);
        setEditFormData({
            email: user.email,
            password: '', // Không hiển thị mật khẩu hiện tại, yêu cầu nhập lại nếu muốn đổi
            firstName: user.firstName,
            lastName: user.lastName,
            // Chuyển đổi Date sang chuỗi YYYY-MM-DD cho input type="date"
            dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
            isEnabled: user.isEnabled,
            phone: user.phone,
            avatar: user.avatar,
            roleNames: Array.isArray(user.roles) ? user.roles : [], // user.roles là Set<String> từ backend, hoặc mảng rỗng
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

    // Hàm xử lý thay đổi Role (nếu bạn muốn chọn nhiều vai trò bằng checkbox hoặc select)
    const handleRoleChange = (event) => {
        // Xử lý khi người dùng nhập chuỗi phân tách bằng dấu phẩy
        const rolesInput = event.target.value;
        const rolesArray = rolesInput.split(',').map(role => role.trim()).filter(role => role !== '');
        setEditFormData({
            ...editFormData,
            roleNames: rolesArray,
        });
    };

    const handleSaveEdit = async () => {
        if (!editingUser) return;

        console.log("UsersAD: Bắt đầu gọi handleSaveEdit...");
        try {
            setLoading(true);
            const payload = { ...editFormData };

            // Xóa trường password nếu người dùng không nhập gì (không muốn đổi mật khẩu)
            if (payload.password === '') {
                delete payload.password;
            }

            // Backend mong đợi roleNames là Set<String>, frontend gửi mảng cũng được
            if (payload.roleNames && Array.isArray(payload.roleNames)) {
                payload.roleNames = Array.from(new Set(payload.roleNames)); // Đảm bảo là mảng unique string
            } else {
                payload.roleNames = []; // Đảm bảo là mảng rỗng nếu không có vai trò nào
            }

            // Convert dateOfBirth string to Date object if needed by backend, or send as string
            // Backend của bạn nhận Date, nên có thể gửi trực tiếp chuỗi ISO 8601 hoặc new Date()
            if (payload.dateOfBirth) {
                payload.dateOfBirth = new Date(payload.dateOfBirth);
            } else {
                payload.dateOfBirth = null; // Gửi null nếu trống để tránh lỗi parsing Date
            }

            const response = await apiClient.put(`/admin/users/${editingUser.id}`, payload);
            console.log("UsersAD: Phản hồi từ API PUT /admin/users:", response.data);

            if (response.data) {
                // Cập nhật lại danh sách người dùng hoặc tải lại
                fetchUsers();
                handleCloseEditDialog();
                alert('Người dùng đã được cập nhật thành công!');
            } else {
                alert('Không thể cập nhật người dùng. Phản hồi trống hoặc không mong muốn.');
            }
        } catch (err) {
            alert('Không thể cập nhật người dùng. Lỗi: ' + (err.response?.data?.message || err.message || 'Không rõ'));
            console.error("UsersAD: Lỗi khi cập nhật người dùng (catch block):", err);
        } finally {
            setLoading(false);
            console.log("UsersAD: Kết thúc handleSaveEdit.");
        }
    };

    // --- Logic cho Thêm Người dùng Mới ---
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
            roleNames: ['USER'], // Mặc định vai trò là 'USER'
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

    // Hàm xử lý thay đổi Role cho form thêm mới
    const handleAddRoleChange = (event) => {
        const rolesInput = event.target.value;
        const rolesArray = rolesInput.split(',').map(role => role.trim()).filter(role => role !== '');
        setAddFormData({
            ...addFormData,
            roleNames: rolesArray,
        });
    };

    const handleSaveAdd = async () => {
        console.log("UsersAD: Bắt đầu gọi handleSaveAdd...");
        try {
            setLoading(true);
            const payload = { ...addFormData };

            // Backend mong đợi roleNames là Set<String>, frontend gửi mảng cũng được
            if (payload.roleNames && Array.isArray(payload.roleNames)) {
                payload.roleNames = Array.from(new Set(payload.roleNames)); // Đảm bảo là mảng unique string
            } else {
                payload.roleNames = ['USER']; // Mặc định nếu không có vai trò nào được chọn
            }

            // Convert dateOfBirth string to Date object
            if (payload.dateOfBirth) {
                payload.dateOfBirth = new Date(payload.dateOfBirth);
            } else {
                payload.dateOfBirth = null;
            }

            const response = await apiClient.post('/admin/users', payload);
            console.log("UsersAD: Phản hồi từ API POST /admin/users:", response.data);

            if (response.data) {
                // Cập nhật lại danh sách người dùng hoặc tải lại
                fetchUsers();
                handleCloseAddDialog();
                alert('Người dùng đã được thêm thành công!');
            } else {
                alert('Không thể thêm người dùng. Phản hồi trống hoặc không mong muốn.');
            }
        } catch (err) {
            alert('Không thể thêm người dùng. Lỗi: ' + (err.response?.data?.message || err.message || 'Không rõ'));
            console.error("UsersAD: Lỗi khi thêm người dùng (catch block):", err);
        } finally {
            setLoading(false);
            console.log("UsersAD: Kết thúc handleSaveAdd.");
        }
    };

    // --- Logic cho Xóa Người dùng (Soft Delete) ---
    const handleDeleteUser = async (userId) => {
        if (window.confirm(`Bạn có chắc muốn xóa người dùng có ID: ${userId}? (Thực hiện xóa mềm)`)) {
            console.log("UsersAD: Bắt đầu gọi handleDeleteUser...");
            try {
                setLoading(true);
                const response = await apiClient.delete(`/admin/users/${userId}`);
                console.log("UsersAD: Phản hồi từ API DELETE /admin/users:", response);

                if (response.status === 200 || response.status === 204) { // 200 OK hoặc 204 No Content
                    // Tải lại danh sách để thấy người dùng đã bị "xóa mềm" (không hiển thị do findAllByIsDeletedFalse)
                    fetchUsers();
                    alert('Người dùng đã được xóa mềm thành công!');
                } else {
                    alert('Không thể xóa người dùng. Lỗi: ' + (response.data?.message || 'Không rõ'));
                }
            } catch (err) {
                alert('Không thể xóa người dùng. Lỗi: ' + (err.response?.data?.message || err.message || 'Không rõ'));
                console.error("UsersAD: Lỗi khi xóa người dùng (catch block):", err);
            } finally {
                setLoading(false);
                console.log("UsersAD: Kết thúc handleDeleteUser.");
            }
        }
    };

    // Hàm định dạng ngày tháng
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) { // Kiểm tra ngày hợp lệ
            console.warn("Invalid date string:", dateString);
            return '';
        }
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('vi-VN', options); // Định dạng tiếng Việt
    };

    // Hàm xử lý khi người dùng thay đổi input tìm kiếm
    const handleSearchInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Hàm xử lý khi nhấn nút tìm kiếm hoặc Enter
    const handleSearchSubmit = () => {
        fetchUsers(searchTerm); // Gọi lại fetchUsers với searchTerm hiện tại
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
                {/* Thanh tìm kiếm */}
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
                </TableContainer>
            )}

            {/* Dialog chỉnh sửa người dùng */}
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
                        disabled // Email thường không được phép chỉnh sửa
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
                        type="date" // Sử dụng type="date"
                        fullWidth
                        variant="standard"
                        value={editFormData.dateOfBirth}
                        onChange={handleEditFormChange}
                        InputLabelProps={{ shrink: true }} // Đảm bảo label không chồng lên giá trị
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
                    {/* Input cho vai trò: Hiện tại là TextField, bạn có thể thay bằng MultiSelect nếu cần */}
                    <TextField
                        margin="dense"
                        name="roleNames"
                        label="Vai trò (phân tách bởi dấu phẩy, VD: USER,ADMIN)"
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

            {/* Dialog THÊM MỚI người dùng */}
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
                    {/* Input cho vai trò: Sử dụng TextField, có thể là input comma-separated */}
                    <TextField
                        margin="dense"
                        name="roleNames"
                        label="Vai trò (phân tách bởi dấu phẩy, VD: USER,ADMIN)"
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
