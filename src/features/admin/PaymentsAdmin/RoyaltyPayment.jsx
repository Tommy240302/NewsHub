import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TablePagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import apiClient from '../../../api/apiClient';

// Biến môi trường Vite
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const formatDateTime = (value) => {
  if (!value) return '-';
  const d = new Date(value);
  if (isNaN(d)) return '-';
  return d.toLocaleString('vi-VN');
};

const RoyaltyPayments = () => {
  const [authors, setAuthors] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [royaltyDetails, setRoyaltyDetails] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination
  const [detailsPage, setDetailsPage] = useState(0);
  const [detailsRowsPerPage, setDetailsRowsPerPage] = useState(5);
  const [historyPage, setHistoryPage] = useState(0);
  const [historyRowsPerPage, setHistoryRowsPerPage] = useState(5);

  // Dialog states
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [transactionContent, setTransactionContent] = useState('');
  const [transactionAccount, setTransactionAccount] = useState('');
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0]);
  const [transactionImageFile, setTransactionImageFile] = useState(null);

  // View image in history
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  // Fetch danh sách tác giả
  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await apiClient.get('/admin/payments/authors');
        setAuthors(Array.isArray(res.data) ? res.data : res.data?.data || []);
      } catch (err) {
        setError('Không thể tải danh sách tác giả.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAuthors();
  }, []);

  const fetchRoyaltyDetailsAndNews = async (authorId) => {
    try {
      setLoading(true);
      setError(null);
      const [royaltyRes, newsRes] = await Promise.all([
        apiClient.get(`/admin/payments/royalty-details/${authorId}`),
        apiClient.get(`/admin/news?authorId=${authorId}`)
      ]);

      const royaltyData = Array.isArray(royaltyRes.data) ? royaltyRes.data : royaltyRes.data?.data || [];
      const newsData = Array.isArray(newsRes.data?.content) ? newsRes.data.content : [];

      const mergedData = royaltyData.map(item => {
        const match = newsData.find(n =>
          (n.id && n.id === item.articleId) ||
          (n.title && n.title.trim() === item.articleTitle.trim())
        );
        return {
          ...item,
          status: match ? (match.status ? 'Đã xuất bản' : 'Chưa duyệt') : '-',
          publishedAt: match ? match.publishedAt : null
        };
      });

      setRoyaltyDetails(mergedData);
    } catch (err) {
      console.error(err);
      setError('Không thể tải dữ liệu nhuận bút và bài viết.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentHistory = async (authorId) => {
    try {
      const res = await apiClient.get(`/admin/payments/history/${authorId}`);
      setPaymentHistory(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch (err) {
      setError('Không thể tải lịch sử giao dịch.');
      console.error(err);
    }
  };

  const handleAuthorChange = (e) => {
    const authorId = e.target.value;
    setSelectedAuthor(authorId);
    if (authorId) {
      fetchRoyaltyDetailsAndNews(authorId);
      fetchPaymentHistory(authorId);
    } else {
      setRoyaltyDetails([]);
      setPaymentHistory([]);
    }
  };

  // Mở dialog Kết xuất
  const handleOpenExport = () => {
    const author = authors.find(a => a.id === selectedAuthor);
    const displayName = author ? `${author.firstName || ''} ${author.lastName || ''}`.trim() || author.email : '';
    const month = new Date(transactionDate).toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' });
    setTransactionContent(`Thanh toán nhuận bút ${month} cho ${displayName}`);
    setTransactionAccount(author?.paymentNumber || '');
    setTransactionImageFile(null);
    setOpenAddDialog(true);
  };

  // Upload ảnh lên Cloudinary
  const handleUploadToCloudinary = async (file) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      return data.secure_url;
    } catch (err) {
      console.error('Upload Cloudinary thất bại', err);
      return null;
    }
  };

  // Thêm giao dịch
  const handleAddTransaction = async () => {
    try {
      if (!selectedAuthor) {
        alert('Vui lòng chọn tác giả.');
        return;
      }
      if (!transactionContent) {
        alert('Vui lòng nhập nội dung.');
        return;
      }

      const totalViews = royaltyDetails.reduce((sum, a) => sum + (a.totalViews ?? 0), 0);
      const lastMonthViews = paymentHistory.length > 0 ? (paymentHistory[paymentHistory.length - 1].viewCurrent || 0) : 0;
      const currentMonthViews = Math.max(totalViews - lastMonthViews, 0);
      const amount = currentMonthViews * 5000;

      const articleIds = royaltyDetails.map((a) => a.articleId ?? a.id).filter(Boolean);

      const formData = new FormData();
      formData.append('content', transactionContent);
      formData.append('amount', String(amount));
      formData.append('viewCurrent', String(totalViews));
      formData.append('accountNumber', transactionAccount || '');
      formData.append('transactionDate', transactionDate);
      
      // --- ĐÃ SỬA LỖI: Đảm bảo luôn gửi trường articleIds ---
      if (articleIds.length > 0) {
        articleIds.forEach(id => {
          formData.append('articleIds', id);
        });
      } else {
        // Gửi một giá trị rỗng nếu không có articleIds nào
        formData.append('articleIds', '');
      }

      // Upload ảnh trước
      let imageUrlToSubmit = '';
      if (transactionImageFile) {
        const uploadedUrl = await handleUploadToCloudinary(transactionImageFile);
        if (!uploadedUrl) {
          alert('Lỗi khi tải ảnh lên Cloudinary. Vui lòng thử lại.');
          return;
        }
        imageUrlToSubmit = uploadedUrl;
      }
      
      formData.append('image', imageUrlToSubmit);

      await apiClient.post(
        `/admin/payments/add-transaction/${selectedAuthor}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setOpenAddDialog(false);
      setTransactionContent('');
      setTransactionAccount('');
      setTransactionImageFile(null);
      fetchPaymentHistory(selectedAuthor);
    } catch (err) {
      console.error(err);
      alert('Lỗi khi thêm giao dịch.');
    }
  };

  // ... (Dialogs và JSX khác)

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Thanh toán nhuận bút</Typography>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Chọn tác giả</InputLabel>
        <Select value={selectedAuthor} label="Chọn tác giả" onChange={handleAuthorChange}>
          {authors.map((author) => (
            <MenuItem key={author.id} value={author.id}>
              {`${author.firstName || ''} ${author.lastName || ''}`.trim() || author.email}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Danh sách bài viết */}
      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h5" gutterBottom>Danh sách bài viết</Typography>
        {royaltyDetails.length === 0 ? (
          <Typography>Chưa có dữ liệu.</Typography>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>STT</TableCell>
                  <TableCell>Tiêu đề</TableCell>
                  <TableCell align="right">Lượt xem</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Ngày đăng</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {royaltyDetails
                  .slice(detailsPage * detailsRowsPerPage, detailsPage * detailsRowsPerPage + detailsRowsPerPage)
                  .map((row, index) => (
                    <TableRow key={row.articleId ?? index}>
                      <TableCell>{detailsPage * detailsRowsPerPage + index + 1}</TableCell>
                      <TableCell>{row.articleTitle}</TableCell>
                      <TableCell align="right">{(row.totalViews ?? 0).toLocaleString('vi-VN')}</TableCell>
                      <TableCell>{row.status || '-'}</TableCell>
                      <TableCell>{row.publishedAt ? formatDateTime(row.publishedAt) : '-'}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={royaltyDetails.length}
              page={detailsPage}
              onPageChange={(e, p) => setDetailsPage(p)}
              rowsPerPage={detailsRowsPerPage}
              onRowsPerPageChange={(e) => {
                setDetailsRowsPerPage(parseInt(e.target.value, 10));
                setDetailsPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </TableContainer>
        )}
        {selectedAuthor && (
          <Button variant="contained" sx={{ mt: 2 }} onClick={handleOpenExport}>
            Kết xuất
          </Button>
        )}
      </Paper>

      {/* Lịch sử giao dịch */}
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>Lịch sử giao dịch</Typography>
        {paymentHistory.length === 0 ? (
          <Typography>Chưa có dữ liệu.</Typography>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>STT</TableCell>
                  <TableCell>Nội dung</TableCell>
                  <TableCell align="right">Số tiền</TableCell>
                  <TableCell>Ngày giao dịch</TableCell>
                  <TableCell align="right">Lượt xem ghi nhận</TableCell>
                  <TableCell>Ảnh</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paymentHistory
                  .slice(historyPage * historyRowsPerPage, historyPage * historyRowsPerPage + historyRowsPerPage)
                  .map((row, index) => (
                    <TableRow key={row.id ?? index}>
                      <TableCell>{historyPage * historyRowsPerPage + index + 1}</TableCell>
                      <TableCell>{row.contentPm}</TableCell>
                      <TableCell align="right">{Number(row.amount || 0).toLocaleString('vi-VN')}</TableCell>
                      <TableCell>{formatDateTime(row.createdAt || row.createdDate)}</TableCell>
                      <TableCell align="right">{row.viewCurrent ?? 0}</TableCell>
                      <TableCell>
                        <Button size="small" onClick={() => { setImageUrl(row.imagePm); setOpenImageDialog(true); }}>
                          Xem
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={paymentHistory.length}
              page={historyPage}
              onPageChange={(e, p) => setHistoryPage(p)}
              rowsPerPage={historyRowsPerPage}
              onRowsPerPageChange={(e) => {
                setHistoryRowsPerPage(parseInt(e.target.value, 10));
                setHistoryPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </TableContainer>
        )}
      </Paper>

      {/* Dialog Kết xuất */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Kết xuất thanh toán</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nội dung"
            fullWidth
            value={transactionContent}
            onChange={(e) => setTransactionContent(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Tổng lượt xem"
            fullWidth
            value={royaltyDetails.reduce((s, a) => s + (a.totalViews ?? 0), 0).toLocaleString('vi-VN')}
            InputProps={{ readOnly: true }}
          />
          <TextField
            margin="dense"
            label="Lượt xem tháng trước"
            fullWidth
            value={(paymentHistory.length > 0 ? (paymentHistory[paymentHistory.length - 1].viewCurrent || 0) : 0).toLocaleString('vi-VN')}
            InputProps={{ readOnly: true }}
          />
          <TextField
            margin="dense"
            label="Lượt xem tháng này"
            fullWidth
            value={(() => {
              const total = royaltyDetails.reduce((s, a) => s + (a.totalViews ?? 0), 0);
              const prev = paymentHistory.length > 0 ? (paymentHistory[paymentHistory.length - 1].viewCurrent || 0) : 0;
              return Math.max(total - prev, 0).toLocaleString('vi-VN');
            })()}
            InputProps={{ readOnly: true }}
          />
          <TextField
            margin="dense"
            label="Tiền nhuận bút"
            fullWidth
            value={(() => {
              const total = royaltyDetails.reduce((s, a) => s + (a.totalViews ?? 0), 0);
              const prev = paymentHistory.length > 0 ? (paymentHistory[paymentHistory.length - 1].viewCurrent || 0) : 0;
              const curr = Math.max(total - prev, 0);
              return (curr * 5000).toLocaleString('vi-VN') + ' VND';
            })()}
            InputProps={{ readOnly: true }}
          />
          <TextField
            margin="dense"
            label="Số tài khoản"
            fullWidth
            value={transactionAccount}
            onChange={(e) => setTransactionAccount(e.target.value)}
            InputProps={{ readOnly: Boolean(authors.find(a => a.id === selectedAuthor)?.paymentNumber) }}
            helperText={authors.find(a => a.id === selectedAuthor)?.paymentNumber ? 'Đã lấy từ hồ sơ tác giả' : 'Tác giả chưa có số tài khoản – vui lòng nhập'}
          />
          <TextField
            margin="dense"
            label="Ngày giao dịch"
            type="date"
            fullWidth
            value={transactionDate}
            onChange={(e) => setTransactionDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" gutterBottom>Ảnh giao dịch (upload)</Typography>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setTransactionImageFile(e.target.files?.[0] || null)}
            />
            {transactionImageFile && (
              <Box sx={{ mt: 1 }}>
                <img
                  alt="preview"
                  src={URL.createObjectURL(transactionImageFile)}
                  style={{ maxWidth: '100%', borderRadius: 8 }}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Hủy</Button>
          <Button variant="contained" color="primary" onClick={handleAddTransaction} startIcon={<AddIcon />}>
            Thêm giao dịch
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog xem ảnh lịch sử */}
      <Dialog open={openImageDialog} onClose={() => setOpenImageDialog(false)} maxWidth="md">
        <DialogTitle>Ảnh giao dịch</DialogTitle>
        <DialogContent>
          {imageUrl ? <img src={imageUrl} alt="Giao dịch" style={{ maxWidth: '100%' }} /> : <Typography>Không có ảnh.</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenImageDialog(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoyaltyPayments;