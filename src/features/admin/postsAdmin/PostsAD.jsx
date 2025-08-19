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
    InputAdornment,
    Pagination, 
} from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete'; 
import VisibilityIcon from '@mui/icons-material/Visibility'; 
import SearchIcon from '@mui/icons-material/Search';
import apiClient from '../../../api/apiClient';

const PostsAD = () => {
    const [allPosts, setAllPosts] = useState([]);
    const [pendingPosts, setPendingPosts] = useState([]);
    const [loadingAll, setLoadingAll] = useState(true);
    const [loadingPending, setLoadingPending] = useState(true);
    const [errorAll, setErrorAll] = useState(null);
    const [errorPending, setErrorPending] = useState(null);
    const [selectedTab, setSelectedTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const [currentPage, setCurrentPage] = useState(0); 
    const [totalPages, setTotalPages] = useState(0); 
    const pageSize = 10; 

    const [isPreviewVisible, setIsPreviewVisible] = useState(false);
    const [previewContent, setPreviewContent] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const fetchAllPosts = async (currentSearchTerm = searchTerm, page = currentPage) => {
        try {
            setLoadingAll(true);
            setErrorAll(null);
            const response = await apiClient.get('/admin/news', {
                params: {
                    searchTerm: currentSearchTerm,
                    page: page,  
                    size: pageSize 
                }
            });
            
            if (response.data && Array.isArray(response.data.content)) {
                setAllPosts(response.data.content);
                setTotalPages(response.data.totalPages);
            } else {
                setErrorAll('Cấu trúc dữ liệu trả về từ backend không hợp lệ cho tất cả bài viết.');
            }
        } catch (err) {
            setErrorAll('Không thể tải danh sách tất cả bài viết. Lỗi: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoadingAll(false);
        }
    };

    const fetchPendingPosts = async () => {
        try {
            setLoadingPending(true);
            setErrorPending(null);
            
            const response = await apiClient.get('/admin/news/pending'); 
            if (response.data && Array.isArray(response.data.data)) {
                setPendingPosts(response.data.data);
            } else {
                setErrorPending('Cấu trúc dữ liệu trả về từ backend không hợp lệ cho bài viết chờ duyệt.');
            }
        } catch (err) {
            setErrorPending('Không thể tải danh sách bài viết chờ duyệt. Lỗi: ' + (err.response?.data?.message || err.message));
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
                if (response.data && response.data.status === 'Success') {
                    alert('Bài viết đã được duyệt thành công!');
                    fetchAllPosts();
                    fetchPendingPosts();
                } else {
                    alert('Không thể duyệt bài viết. Lỗi: ' + (response.data?.errorMessage || 'Không rõ'));
                }
            } catch (err) {
                alert('Không thể duyệt bài viết. Lỗi: ' + (err.response?.data?.message || err.message || 'Không rõ'));
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
                if (response.status === 204 || (response.data && response.data.status === 'Success')) {
                    alert('Bài viết đã được xóa mềm thành công!');
                    fetchAllPosts();
                    fetchPendingPosts();
                } else {
                    alert('Không thể xóa bài viết. Lỗi: ' + (response.data?.message || 'Không rõ'));
                }
            } catch (err) {
                alert('Không thể xóa bài viết. Lỗi: ' + (err.response?.data?.message || err.message || 'Không rõ'));
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
        setPreviewContent('');
        setPreviewTitle('');
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
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Đang tải danh sách bài viết...</Typography>
            </Box>
        );
    }

    if (errorAll && errorPending) {
        return <Alert severity="error">Lỗi khi tải dữ liệu: {errorAll} và {errorPending}</Alert>;
    } else if (errorAll) {
        return <Alert severity="error">Lỗi khi tải tất cả bài viết: {errorAll}</Alert>;
    } else if (errorPending) {
        return <Alert severity="error">Lỗi khi tải bài viết chờ duyệt: {errorPending}</Alert>;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Quản lý Bài viết
            </Typography>

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={selectedTab} onChange={handleTabChange} aria-label="quản lý bài viết tabs">
                    <Tab label="Tất cả Bài viết" value="all" />
                    <Tab label="Bài viết chờ duyệt" value="pending" />
                </Tabs>
            </Box>

            {selectedTab === 'all' && (
                <Box sx={{ pt: 2 }}>
                    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <TextField
                            label="Tìm kiếm theo tiêu đề"
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
                                            <TableCell>{post.status ? 'Đã duyệt' : 'Chờ duyệt'}</TableCell>
                                            <TableCell>{post.views ? post.views.toLocaleString('vi-VN') : '0'}</TableCell>
                                            <TableCell>{post.createdAt ? new Date(post.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</TableCell>
                                            <TableCell>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('vi-VN') : 'N/A'}</TableCell>
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
                                                    onClick={() => handlePreviewPost(post.content, post.title)}
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
                    
                   
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 2 }}>
                        
                        <Pagination 
                            count={totalPages} 
                            page={currentPage + 1} 
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </Box>
                </Box>
            )}

            {selectedTab === 'pending' && (
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
                                        <TableCell align="center">Hành động</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {pendingPosts.map((post) => (
                                        <TableRow key={post.id}>
                                            <TableCell>{post.id}</TableCell>
                                            <TableCell>{post.title}</TableCell>
                                            <TableCell>{post.authorName}</TableCell>
                                            <TableCell>{post.createdAt ? new Date(post.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    size="small"
                                                    color="success"
                                                    onClick={() => handleApprovePost(post.id)}
                                                    disabled={post.isDeleted || post.status} 
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
                                                    onClick={() => handlePreviewPost(post.content, post.title)}
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
                </Box>
            )}

            <Dialog open={isPreviewVisible} onClose={handleClosePreviewDialog} maxWidth="md" fullWidth>
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
