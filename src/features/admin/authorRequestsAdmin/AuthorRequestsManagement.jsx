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
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import moment from 'moment';

// Styled components
const StatusChip = styled(Chip)(({ theme, status }) => ({
  backgroundColor:
    status === 'PENDING'
      ? '#ffeb3b' // Yellow
      : status === 'ACCEPTED'
      ? '#4caf50' // Green
      : status === 'DENIED'
      ? '#f44336' // Red
      : '#9e9e9e', // Grey
  color: status === 'PENDING' ? '#000' : '#fff',
  fontWeight: 'bold',
}));

const ActionButton = styled(Button)(({ theme, type }) => ({
  marginRight: theme.spacing(1),
  minWidth: '80px',
  ...(type === 'approve' && {
    backgroundColor: theme.palette.success.main,
    color: '#fff',
    '&:hover': {
      backgroundColor: theme.palette.success.dark,
    },
  }),
  ...(type === 'reject' && {
    backgroundColor: theme.palette.error.main,
    color: '#fff',
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
    },
  }),
}));

const AuthorRequestsManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAuthorRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:6969/admin/author-requests', {
        withCredentials: true,
      });
      console.log("API Response:", response.data); // Log để kiểm tra cấu trúc dữ liệu
      if (response.data && response.data.status === 'Success') {
        setRequests(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch requests.');
      }
    } catch (err) {
      console.error('Error fetching author requests:', err);
      setError('Could not connect to the server or fetch requests.');
      setSnackbar({ open: true, message: 'Lỗi khi tải yêu cầu: ' + (err.response?.data?.errorMessage || err.message), severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthorRequests();
  }, []);

  const handleOpenDialog = (request) => {
    setSelectedRequest(request);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRequest(null);
  };

  const handleAction = async (requestId, actionType) => {
    if (!requestId) {
      setSnackbar({ open: true, message: "Lỗi: ID yêu cầu không hợp lệ.", severity: 'error' });
      return;
    }

    setActionLoading(true);
    try {
      const endpoint = `http://localhost:6969/admin/author-requests/${requestId}/${actionType}`;
      const response = await axios.put(endpoint, {}, {
        withCredentials: true,
      });

      if (response.data && response.data.status === 'Success') {
        setSnackbar({ open: true, message: `Yêu cầu đã được ${actionType === 'approve' ? 'phê duyệt' : 'từ chối'} thành công!`, severity: 'success' });
        fetchAuthorRequests();
        handleCloseDialog();
      } else {
        setSnackbar({ open: true, message: response.data.errorMessage || `Lỗi khi ${actionType === 'approve' ? 'phê duyệt' : 'từ chối'} yêu cầu.`, severity: 'error' });
      }
    } catch (err) {
      console.error(`Error ${actionType}ing request:`, err);
      setSnackbar({ open: true, message: `Lỗi khi ${actionType === 'approve' ? 'phê duyệt' : 'từ chối'} yêu cầu: ` + (err.response?.data?.errorMessage || err.message), severity: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
        <Typography variant="h6" ml={2}>Đang tải yêu cầu...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh" flexDirection="column">
        <Typography variant="h6" color="error">Lỗi: {error}</Typography>
        <Button onClick={fetchAuthorRequests} variant="contained" sx={{ mt: 2 }}>Thử lại</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Quản Lý Yêu Cầu Tác Giả
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Email người dùng</TableCell>
              <TableCell>Số tài khoản</TableCell>{/* Thêm cột mới */}
              <TableCell>Ngày yêu cầu</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center"> {/* Cập nhật số cột */}
                  Không có yêu cầu nào.
                </TableCell>
              </TableRow>
            ) : (
              requests.map((request) => (
                <TableRow
                  key={request.id || request.requestId || request.userEmail}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {request.id}
                  </TableCell>
                  <TableCell>{request.userEmail}</TableCell>
                  <TableCell>{request.paymentNumber}</TableCell> {/* Thêm ô dữ liệu mới */}
                  <TableCell>{moment(request.createdAt).format('DD/MM/YYYY HH:mm')}</TableCell>
                  <TableCell>
                    <StatusChip label={request.status} status={request.status} />
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleOpenDialog(request)}
                      disabled={actionLoading}
                    >
                      Xem chi tiết
                    </Button>
                    {request.status === 'PENDING' && (
                      <>
                        <ActionButton
                          type="approve"
                          variant="contained"
                          size="small"
                          onClick={() => handleAction(request.id, 'approve')}
                          disabled={actionLoading}
                        >
                          {actionLoading ? <CircularProgress size={20} color="inherit" /> : 'Duyệt'}
                        </ActionButton>
                        <ActionButton
                          type="reject"
                          variant="contained"
                          size="small"
                          onClick={() => handleAction(request.id, 'reject')}
                          disabled={actionLoading}
                        >
                          {actionLoading ? <CircularProgress size={20} color="inherit" /> : 'Từ chối'}
                        </ActionButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog chi tiết yêu cầu */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Chi tiết Yêu cầu Tác giả</DialogTitle>
        {selectedRequest && (
          <DialogContent dividers>
            <Typography variant="body1"><strong>ID:</strong> {selectedRequest.id}</Typography>
            <Typography variant="body1"><strong>Email người dùng:</strong> {selectedRequest.userEmail}</Typography>
            <Typography variant="body1"><strong>Số thanh toán:</strong> {selectedRequest.paymentNumber || 'Không có'}</Typography> {/* Thêm dòng mới vào dialog */}
            <Typography variant="body1"><strong>Ngày yêu cầu:</strong> {moment(selectedRequest.createdAt).format('DD/MM/YYYY HH:mm')}</Typography>
            <Typography variant="body1"><strong>Trạng thái:</strong> <StatusChip label={selectedRequest.status} status={selectedRequest.status} /></Typography>
            <Typography variant="body1" mt={2}><strong>Lý do:</strong> {selectedRequest.reason || 'Không có'}</Typography>
            <Typography variant="body1">
              <strong>URL Hồ sơ:</strong>{' '}
              {selectedRequest.profileUrl ? (
                <Link href={selectedRequest.profileUrl} target="_blank" rel="noopener noreferrer">
                  {selectedRequest.profileUrl}
                </Link>
              ) : (
                'Không có'
              )}
            </Typography>
            <Typography variant="body1">
              <strong>URL Bài viết mẫu:</strong>{' '}
              {selectedRequest.sampleArticles ? (
                <Link href={selectedRequest.sampleArticles} target="_blank" rel="noopener noreferrer">
                  {selectedRequest.sampleArticles}
                </Link>
              ) : (
                'Không có'
              )}
            </Typography>
          </DialogContent>
        )}
        <DialogActions>
          {selectedRequest?.status === 'PENDING' && (
            <>
              <ActionButton
                type="approve"
                variant="contained"
                onClick={() => handleAction(selectedRequest.id, 'approve')}
                disabled={actionLoading}
              >
                {actionLoading ? <CircularProgress size={20} color="inherit" /> : 'Duyệt'}
              </ActionButton>
              <ActionButton
                type="reject"
                variant="contained"
                onClick={() => handleAction(selectedRequest.id, 'reject')}
                disabled={actionLoading}
              >
                {actionLoading ? <CircularProgress size={20} color="inherit" /> : 'Từ chối'}
              </ActionButton>
            </>
          )}
          <Button onClick={handleCloseDialog} color="primary" disabled={actionLoading}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar thông báo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AuthorRequestsManagement;
