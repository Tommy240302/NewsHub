import React, { useEffect, useState, useCallback } from 'react';
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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Snackbar,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RestoreIcon from '@mui/icons-material/Restore';
import apiClient from '../../../api/apiClient'; // Đảm bảo đường dẫn này đúng

// Helper function to flatten the hierarchical categories for display
// and to create a lookup map for parent selection
const flattenCategories = (categories, flatList = [], parentPath = '', level = 0) => {
    categories.forEach(category => {
        // Add the current category to the flat list
        flatList.push({
            id: category.id,
            content: category.content,
            parentId: category.parentId, // Added for edit/add forms
            parentContent: category.parentContent, // Already available from DTO
            isDeleted: category.isDeleted, // QUAN TRỌNG: Giữ lại trường này
            // Store a path for display in dropdown, e.g., "Parent > Child"
            fullPath: parentPath ? `${parentPath} > ${category.content}` : category.content,
            level: level, // Add level for indentation
        });
        // Recursively add children
        if (category.children && category.children.length > 0) {
            flattenCategories(category.children, flatList, parentPath ? `${parentPath} > ${category.content}` : category.content, level + 1);
        }
    });
    return flatList;
};

const CategoriesAD = () => {
    const [categories, setCategories] = useState([]); // Raw hierarchical data from backend
    const [flatCategories, setFlatCategories] = useState([]); // Flattened data for table display
    const [parentOptions, setParentOptions] = useState([]); // For parent selection dropdown
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State cho dialog chỉnh sửa
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [editFormData, setEditFormData] = useState({ content: '', parentId: '' });
    const [editValidationErrors, setEditValidationErrors] = useState({});

    // State cho dialog thêm mới
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [addFormData, setAddFormData] = useState({ content: '', parentId: '' });
    const [addValidationErrors, setAddValidationErrors] = useState({});

    // Snackbar state
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success', // 'success', 'error', 'warning', 'info'
    });

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    // Hàm để tải danh sách thể loại từ backend
    const fetchCategories = useCallback(async () => {
        console.log("CategoriesAD: Bắt đầu gọi fetchCategories...");
        try {
            setLoading(true);
            setError(null);

            const response = await apiClient.get('/admin/categories');
            console.log("CategoriesAD: Phản hồi từ API GET /admin/categories:", response.data);

            if (response.data && response.data.data && Array.isArray(response.data.data)) {
                const fetchedCategories = response.data.data;
                setCategories(fetchedCategories);

                let flat = flattenCategories(fetchedCategories);

                // Sắp xếp flatCategories theo ID tăng dần
                flat.sort((a, b) => a.id - b.id);

                setFlatCategories(flat);

                // Chuẩn bị options cho dropdown Parent Category (cho cả thêm và sửa)
                // Quan trọng: Sử dụng '' thay vì null cho option gốc để tránh cảnh báo React
                const options = [{ id: '', fullPath: 'Không có (Category gốc)' }]; 
                flattenCategories(response.data.data).forEach(cat => {
                    if (!cat.isDeleted) { // Chỉ các category đang hoạt động mới có thể làm cha
                        options.push({ id: cat.id, fullPath: cat.fullPath });
                    }
                });
                setParentOptions(options);

                console.log("CategoriesAD: Dữ liệu thể loại đã tải thành công:", fetchedCategories);
                console.log("CategoriesAD: Dữ liệu phẳng cho bảng (đã sắp xếp):", flat);

            } else {
                const errorMessage = 'Cấu trúc dữ liệu trả về từ backend không hợp lệ hoặc thiếu trường "data".';
                setError(errorMessage);
                setSnackbar({ open: true, message: errorMessage, severity: 'error' });
                console.error("CategoriesAD: Cấu trúc dữ liệu backend không đúng định dạng:", response.data);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.errorMessage || err.response?.data?.message || err.message || 'Không rõ nguyên nhân.';
            setError('Không thể tải danh sách thể loại. Lỗi: ' + errorMessage);
            setSnackbar({ open: true, message: 'Lỗi tải thể loại: ' + errorMessage, severity: 'error' });
            console.error("CategoriesAD: Lỗi khi tải thể loại (catch block):", err);
        } finally {
            setLoading(false);
            console.log("CategoriesAD: Kết thúc fetchCategories.");
        }
    }, []); // Sử dụng một mảng rỗng vì hàm này không phụ thuộc vào props hay state nào thay đổi bên ngoài.

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]); // fetchCategories được bọc trong useCallback, nên nó ổn định.

    // Validation helper
    const validateForm = (formData, setErrors) => {
        let errors = {};
        if (!formData.content.trim()) {
            errors.content = "Tên thể loại không được để trống.";
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // --- Logic cho Chỉnh sửa Thể loại ---
    const handleEditClick = (category) => {
        setEditingCategory(category);
        setEditFormData({
            content: category.content,
            parentId: category.parentId || '' // Đặt rỗng nếu không có parent, tránh null
        });
        setEditValidationErrors({}); // Clear errors
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setEditingCategory(null);
        setEditValidationErrors({});
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({ ...editFormData, [name]: value });
        setEditValidationErrors(prev => ({ ...prev, [name]: undefined })); // Clear specific error on change
    };

    const handleSaveEdit = async () => {
        if (!editingCategory) return;

        if (!validateForm(editFormData, setEditValidationErrors)) {
            setSnackbar({ open: true, message: "Vui lòng điền đầy đủ thông tin.", severity: 'warning' });
            return;
        }

        // Additional check for self-parenting loop
        if (editFormData.parentId && editFormData.parentId === editingCategory.id) {
            setEditValidationErrors(prev => ({ ...prev, parentId: "Category không thể là cha của chính nó." }));
            setSnackbar({ open: true, message: "Category không thể là cha của chính nó.", severity: 'warning' });
            return;
        }

        console.log("CategoriesAD: Bắt đầu gọi handleSaveEdit...");
        try {
            setLoading(true);
            const payload = {
                content: editFormData.content,
                parentId: editFormData.parentId === '' ? null : editFormData.parentId // Chuyển '' thành null khi gửi lên backend
            };

            const response = await apiClient.put(`/admin/categories/${editingCategory.id}`, payload);
            console.log("CategoriesAD: Phản hồi từ API PUT /admin/categories:", response.data);

            // Kiểm tra phản hồi thành công từ backend
            if (response.data && response.data.status === 'Success') { // Chỉ cần kiểm tra status là 'Success'
                fetchCategories(); // Tải lại dữ liệu sau khi cập nhật
                handleCloseEditDialog();
                setSnackbar({ open: true, message: response.data.message || 'Thể loại đã được cập nhật thành công!', severity: 'success' });
            } else if (response.data && response.data.status === 'Fail') { // Kiểm tra status là 'Fail'
                const msg = response.data.errorMessage || response.data.message || 'Không thể cập nhật thể loại.';
                setSnackbar({ open: true, message: `Lỗi: ${msg}`, severity: 'error' });
                // Có thể thêm logic xử lý lỗi cụ thể nếu backend trả về validationErrors
            } else { // Trường hợp phản hồi không theo cấu trúc mong đợi
                const msg = response.data?.message || 'Có lỗi xảy ra khi cập nhật thể loại, không rõ chi tiết.';
                setSnackbar({ open: true, message: `Lỗi: ${msg}`, severity: 'error' });
            }
        } catch (err) {
            const msg = err.response?.data?.errorMessage || err.response?.data?.message || err.message || 'Lỗi kết nối hoặc lỗi server không xác định.';
            setSnackbar({ open: true, message: `Lỗi cập nhật: ${msg}`, severity: 'error' });
            // Có thể thêm logic xử lý lỗi HTTP status code cụ thể nếu cần
            console.error("CategoriesAD: Lỗi khi cập nhật thể loại (catch block):", err);
        } finally {
            setLoading(false);
            console.log("CategoriesAD: Kết thúc handleSaveEdit.");
        }
    };

    // --- Logic cho Thêm Thể loại Mới ---
    const handleAddClick = () => {
        setAddFormData({ content: '', parentId: '' }); // Reset form khi mở, đảm bảo parentId là ''
        setAddValidationErrors({}); // Clear errors
        setOpenAddDialog(true);
    };

    const handleCloseAddDialog = () => {
        setOpenAddDialog(false);
        setAddValidationErrors({});
    };

    const handleAddFormChange = (e) => {
        const { name, value } = e.target;
        setAddFormData({ ...addFormData, [name]: value });
        setAddValidationErrors(prev => ({ ...prev, [name]: undefined })); // Clear specific error on change
    };

    const handleSaveAdd = async () => {
        if (!validateForm(addFormData, setAddValidationErrors)) {
            setSnackbar({ open: true, message: "Vui lòng điền đầy đủ thông tin.", severity: 'warning' });
            return;
        }

        console.log("CategoriesAD: Bắt đầu gọi handleSaveAdd...");
        try {
            setLoading(true);
            const payload = {
                content: addFormData.content,
                parentId: addFormData.parentId === '' ? null : addFormData.parentId // Chuyển '' thành null khi gửi lên backend
            };

            const response = await apiClient.post('/admin/categories', payload);
            console.log("CategoriesAD: Phản hồi từ API POST /admin/categories:", response.data);

            // Kiểm tra phản hồi thành công từ backend
            if (response.data && response.data.status === 'Success') { // Chỉ cần kiểm tra status là 'Success'
                fetchCategories(); // Tải lại dữ liệu sau khi thêm
                handleCloseAddDialog();
                setSnackbar({ 
                    open: true, 
                    message: response.data.message || 'Thể loại đã được thêm thành công!', 
                    severity: 'success' 
                });
            } else if (response.data && response.data.status === 'Fail') { // Kiểm tra status là 'Fail'
                const msg = response.data.errorMessage || response.data.message || 'Không thể thêm thể loại.';
                setSnackbar({ open: true, message: `Lỗi: ${msg}`, severity: 'error' });
                // Có thể thêm logic xử lý lỗi cụ thể nếu backend trả về validationErrors
            } else { // Trường hợp phản hồi không theo cấu trúc mong đợi
                const msg = response.data?.message || 'Có lỗi xảy ra khi thêm thể loại, không rõ chi tiết.';
                setSnackbar({ open: true, message: `Lỗi: ${msg}`, severity: 'error' });
            }
        } catch (err) {
            const msg = err.response?.data?.errorMessage || err.response?.data?.message || err.message || 'Lỗi kết nối hoặc lỗi server không xác định.';
            setSnackbar({ open: true, message: `Lỗi thêm: ${msg}`, severity: 'error' });
            // Có thể thêm logic xử lý lỗi HTTP status code cụ thể nếu cần
            console.error("CategoriesAD: Lỗi khi thêm thể loại (catch block):", err);
        } finally {
            setLoading(false);
            console.log("CategoriesAD: Kết thúc handleSaveAdd.");
        }
    };

    // --- Logic cho Xóa MỀM Thể loại ---
    const handleDeleteCategory = async (categoryId) => {
        const confirmMessage = `Bạn có chắc chắn muốn XÓA MỀM thể loại này (ID: ${categoryId})?\n\nCảnh báo: Thể loại chỉ có thể xóa mềm nếu không có thể loại con ĐANG HOẠT ĐỘNG hoặc bài viết ĐANG HOẠT ĐỘNG liên quan. Bạn có thể khôi phục lại sau.`;

        if (!window.confirm(confirmMessage)) {
            return; // Người dùng hủy xóa
        }

        console.log("CategoriesAD: Bắt đầu gọi handleDeleteCategory (Xóa Mềm)...");
        try {
            setLoading(true);
            // Gọi API DELETE, backend sẽ xử lý nó là xóa mềm
            const response = await apiClient.delete(`/admin/categories/${categoryId}`);
            console.log("CategoriesAD: Phản hồi từ API DELETE /admin/categories/:", response); // Log toàn bộ response

            // Kiểm tra HTTP status code trước, đặc biệt là 204 No Content
            if (response.status === 204) { // Thành công và không có nội dung trả về
                fetchCategories(); // Tải lại danh sách
                setSnackbar({ open: true, message: 'Thể loại đã được xóa mềm thành công!', severity: 'success' });
            } else if (response.data && response.data.status === 'Success') { // Thành công với body phản hồi
                fetchCategories(); // Tải lại danh sách
                setSnackbar({ open: true, message: response.data.message || 'Thể loại đã được xóa mềm thành công!', severity: 'success' });
            } else if (response.data && response.data.status === 'Fail') { // Lỗi từ backend với body phản hồi
                const msg = response.data.errorMessage || response.data.message || 'Không thể xóa thể loại.';
                setSnackbar({ open: true, message: `Lỗi: ${msg}`, severity: 'error' });
            } else { // Trường hợp phản hồi không theo cấu trúc mong đợi hoặc lỗi không xác định
                const msg = response.data?.message || `Không thể xóa thể loại. Lỗi không xác định. HTTP Status: ${response.status}`;
                setSnackbar({ open: true, message: `Lỗi: ${msg}`, severity: 'error' });
            }
        } catch (err) {
            const msg = err.response?.data?.errorMessage || err.response?.data?.message || err.message || 'Không rõ nguyên nhân.';
            setSnackbar({ open: true, message: `Lỗi xóa: ${msg}`, severity: 'error' });
            console.error("CategoriesAD: Lỗi khi xóa thể loại (catch block):", err);
        } finally {
            setLoading(false);
            console.log("CategoriesAD: Kết thúc handleDeleteCategory.");
        }
    };

    // --- Logic cho KHÔI PHỤC Thể loại ---
    const handleRestoreCategory = async (categoryId) => {
        const confirmMessage = `Bạn có chắc chắn muốn KHÔI PHỤC thể loại này (ID: ${categoryId})?`;

        if (!window.confirm(confirmMessage)) {
            return;
        }

        console.log("CategoriesAD: Bắt đầu gọi handleRestoreCategory...");
        try {
            setLoading(true);
            // Gọi API khôi phục
            const response = await apiClient.put(`/admin/categories/${categoryId}/restore`);
            console.log("CategoriesAD: Phản hồi từ API PUT /admin/categories/{id}/restore:", response); // Log toàn bộ response

            // Kiểm tra phản hồi thành công từ backend
            if (response.data && response.data.status === 'Success') { // Thành công với body phản hồi
                fetchCategories(); // Tải lại danh sách
                setSnackbar({ open: true, message: response.data.message || 'Thể loại đã được khôi phục thành công!', severity: 'success' });
            } else if (response.data && response.data.status === 'Fail') { // Lỗi từ backend với body phản hồi
                const msg = response.data.errorMessage || response.data.message || 'Không thể khôi phục thể loại.';
                setSnackbar({ open: true, message: `Lỗi: ${msg}`, severity: 'error' });
            } else { // Trường hợp phản hồi không theo cấu trúc mong đợi hoặc lỗi không xác định
                const msg = response.data?.message || `Không thể khôi phục thể loại. Lỗi không xác định. HTTP Status: ${response.status}`;
                setSnackbar({ open: true, message: `Lỗi: ${msg}`, severity: 'error' });
            }
        } catch (err) {
            const msg = err.response?.data?.errorMessage || err.response?.data?.message || err.message || 'Không rõ nguyên nhân.';
            setSnackbar({ open: true, message: `Lỗi khôi phục: ${msg}`, severity: 'error' });
            console.error("CategoriesAD: Lỗi khi khôi phục thể loại (catch block):", err);
        } finally {
            setLoading(false);
            console.log("CategoriesAD: Kết thúc handleRestoreCategory.");
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Đang tải danh sách thể loại...</Typography>
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Quản lý Thể loại
            </Typography>
            <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                sx={{ mb: 2 }}
                onClick={handleAddClick}
            >
                Thêm Thể loại
            </Button>
            {flatCategories.length === 0 ? (
                <Typography>Không có thể loại nào để hiển thị.</Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Tên Thể loại</TableCell>
                                <TableCell>Category Cha</TableCell>
                                <TableCell>Trạng thái</TableCell>
                                <TableCell align="center">Hành động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {flatCategories.map((category) => (
                                <TableRow key={category.id} sx={{ '&.MuiTableRow-root': { backgroundColor: category.isDeleted ? '#f2f2f2' : 'inherit' } }}>
                                    <TableCell>{category.id}</TableCell>
                                    <TableCell style={{ paddingLeft: `${16 + category.level * 20}px` }}>
                                        {category.fullPath}
                                    </TableCell>
                                    <TableCell>{category.parentContent || 'N/A'}</TableCell>
                                    <TableCell>
                                        {category.isDeleted ? (
                                            <Typography variant="caption" color="error">Đã xóa</Typography>
                                        ) : (
                                            <Typography variant="caption" color="success">Hoạt động</Typography>
                                        )}
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={() => handleEditClick(category)}
                                            disabled={category.isDeleted} // Không cho chỉnh sửa nếu đã xóa mềm
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        {category.isDeleted ? (
                                            <IconButton
                                                size="small"
                                                color="success"
                                                onClick={() => handleRestoreCategory(category.id)}
                                            >
                                                <RestoreIcon />
                                            </IconButton>
                                        ) : (
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDeleteCategory(category.id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Dialog chỉnh sửa thể loại */}
            <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
                <DialogTitle>Chỉnh sửa thể loại</DialogTitle>
                <DialogContent>
                    {editValidationErrors.general && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {editValidationErrors.general}
                        </Alert>
                    )}
                    <TextField
                        autoFocus
                        margin="dense"
                        name="content"
                        label="Tên thể loại"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={editFormData.content}
                        onChange={handleEditFormChange}
                        error={!!editValidationErrors.content}
                        helperText={editValidationErrors.content}
                        sx={{ mb: 2 }}
                    />
                    <FormControl fullWidth margin="dense" variant="standard" error={!!editValidationErrors.parentId}>
                        <InputLabel>Category Cha</InputLabel>
                        <Select
                            name="parentId"
                            value={editFormData.parentId}
                            onChange={handleEditFormChange}
                            label="Category Cha"
                        >
                            {parentOptions
                                .filter(opt => opt.id !== editingCategory?.id) // Lọc bỏ chính nó khỏi danh sách cha
                                .map(option => (
                                    // Đảm bảo value luôn là chuỗi, nếu option.id là null thì truyền ''
                                    <MenuItem key={option.id === '' ? 'null-option' : option.id} value={option.id}> 
                                        {option.fullPath}
                                    </MenuItem>
                                ))}
                        </Select>
                        {editValidationErrors.parentId && (
                            <Typography color="error" variant="caption">
                                {editValidationErrors.parentId}
                            </Typography>
                        )}
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditDialog}>Hủy</Button>
                    <Button onClick={handleSaveEdit}>Lưu</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog THÊM MỚI thể loại */}
            <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
                <DialogTitle>Thêm thể loại mới</DialogTitle>
                <DialogContent>
                    {addValidationErrors.general && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {addValidationErrors.general}
                        </Alert>
                    )}
                    <TextField
                        autoFocus
                        margin="dense"
                        name="content"
                        label="Tên thể loại"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={addFormData.content}
                        onChange={handleAddFormChange}
                        error={!!addValidationErrors.content}
                        helperText={addValidationErrors.content}
                        sx={{ mb: 2 }}
                    />
                    <FormControl fullWidth margin="dense" variant="standard">
                        <InputLabel>Category Cha</InputLabel>
                        <Select
                            name="parentId"
                            value={addFormData.parentId}
                            onChange={handleAddFormChange}
                            label="Category Cha"
                        >
                            {parentOptions.map(option => (
                                // Đảm bảo value luôn là chuỗi, nếu option.id là null thì truyền ''
                                <MenuItem key={option.id === '' ? 'null-option' : option.id} value={option.id}>
                                    {option.fullPath}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddDialog}>Hủy</Button>
                    <Button onClick={handleSaveAdd}>Thêm</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default CategoriesAD;
