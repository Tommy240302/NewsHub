import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
} from '@mui/material';
import api from '../../../services/mockApi'; // Import API của bạn

const StatisticsAD = () => {
  const [authorRevenue, setAuthorRevenue] = useState([]);
  const [mostViewedPosts, setMostViewedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        // Lấy doanh thu của tác giả
        const revenueResponse = await api.get('/admin/statistics/author-revenue');
        setAuthorRevenue(revenueResponse.data);

        // Lấy bài viết có lượt xem cao nhất
        const postsResponse = await api.get('/admin/statistics/most-viewed-posts');
        setMostViewedPosts(postsResponse.data);
      } catch (err) {
        setError('Không thể tải dữ liệu thống kê. Vui lòng thử lại.');
        console.error("Error fetching statistics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Đang tải thống kê...</Typography>
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Thống kê Tổng quan
      </Typography>

      {/* Doanh thu của tác giả */}
      <Paper elevation={3} sx={{ mb: 4, p: 2 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Doanh thu của Tác giả
        </Typography>
        {authorRevenue.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tác giả</TableCell>
                  <TableCell align="right">Doanh thu (VND)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {authorRevenue.map((row) => (
                  <TableRow key={row.author}>
                    <TableCell>{row.author}</TableCell>
                    <TableCell align="right">{row.revenue.toLocaleString('vi-VN')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>Chưa có dữ liệu doanh thu tác giả.</Typography>
        )}
      </Paper>

      {/* Những bài viết có lượt xem cao nhất */}
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Bài viết có lượt xem cao nhất
        </Typography>
        {mostViewedPosts.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tiêu đề Bài viết</TableCell>
                  <TableCell>Tác giả</TableCell>
                  <TableCell align="right">Lượt xem</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mostViewedPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>{post.title}</TableCell>
                    <TableCell>{post.author}</TableCell>
                    <TableCell align="right">{post.views.toLocaleString('vi-VN')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>Chưa có dữ liệu bài viết có lượt xem cao nhất.</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default StatisticsAD;