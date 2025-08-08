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
  Grid,
  Card,
  CardContent,
  TablePagination, // Import TablePagination
} from '@mui/material';

import apiClient from '../../../api/apiClient';

const Statistics = () => {
  const [authorRevenue, setAuthorRevenue] = useState([]);
  const [mostViewedPosts, setMostViewedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States cho phân trang Doanh thu Tác giả
  const [revenuePage, setRevenuePage] = useState(0);
  const [revenueRowsPerPage, setRevenueRowsPerPage] = useState(5);

  // States cho phân trang Bài viết xem nhiều nhất
  const [postsPage, setPostsPage] = useState(0);
  const [postsRowsPerPage, setPostsRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch Author Revenue
        const revenueResponse = await apiClient.get('/admin/statistics/top-authors-by-revenue');
        if (revenueResponse.data && Array.isArray(revenueResponse.data.data)) {
          setAuthorRevenue(revenueResponse.data.data);
        } else {
          setError('Cấu trúc dữ liệu doanh thu tác giả không hợp lệ.');
          console.error("Statistics: Invalid author revenue data structure:", revenueResponse.data);
        }

        // Fetch Most Viewed Posts
        const postsResponse = await apiClient.get('/admin/statistics/top-news-by-views');
        if (postsResponse.data && Array.isArray(postsResponse.data.data)) {
          setMostViewedPosts(postsResponse.data.data);
        } else {
          setError('Cấu trúc dữ liệu bài viết xem nhiều nhất không hợp lệ.');
          console.error("Statistics: Invalid most viewed posts data structure:", postsResponse.data);
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Không rõ nguyên nhân.';
        setError('Không thể tải dữ liệu thống kê: ' + errorMessage);
        console.error("Statistics: Error fetching statistics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  // Hàm xử lý thay đổi trang cho bảng Doanh thu
  const handleRevenueChangePage = (event, newPage) => {
    setRevenuePage(newPage);
  };

  // Hàm xử lý thay đổi số hàng mỗi trang cho bảng Doanh thu
  const handleRevenueChangeRowsPerPage = (event) => {
    setRevenueRowsPerPage(parseInt(event.target.value, 10));
    setRevenuePage(0);
  };

  // Hàm xử lý thay đổi trang cho bảng Bài viết
  const handlePostsChangePage = (event, newPage) => {
    setPostsPage(newPage);
  };

  // Hàm xử lý thay đổi số hàng mỗi trang cho bảng Bài viết
  const handlePostsChangeRowsPerPage = (event) => {
    setPostsRowsPerPage(parseInt(event.target.value, 10));
    setPostsPage(0);
  };

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

  const totalRevenue = authorRevenue.reduce((sum, author) => sum + author.totalRevenue, 0);
  const totalViews = mostViewedPosts.reduce((sum, post) => sum + post.views, 0);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Thống kê Tổng quan
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Tổng Doanh thu Tác giả
              </Typography>
              <Typography variant="h4" component="div">
                {totalRevenue.toLocaleString('vi-VN')} VND
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Tổng Lượt xem Bài viết
              </Typography>
              <Typography variant="h4" component="div">
                {totalViews.toLocaleString('vi-VN')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Bảng Doanh thu của Tác giả */}
        <Grid item xs={12} md={6}> {/* Dùng md={6} để chia đôi màn hình trên desktop */}
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Doanh thu của Tác giả
            </Typography>
            {authorRevenue.length === 0 ? (
              <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                Chưa có dữ liệu doanh thu tác giả để hiển thị.
              </Typography>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Tác giả</TableCell>
                      <TableCell align="right">Doanh thu (VND)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(revenueRowsPerPage > 0
                      ? authorRevenue.slice(revenuePage * revenueRowsPerPage, revenuePage * revenueRowsPerPage + revenueRowsPerPage)
                      : authorRevenue
                    ).map((author) => (
                      <TableRow key={author.authorId}>
                        <TableCell>{`${author.authorFirstName || ''} ${author.authorLastName || ''}`.trim() || author.authorEmail}</TableCell>
                        <TableCell align="right">{author.totalRevenue.toLocaleString('vi-VN')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <TablePagination
                  component="div"
                  count={authorRevenue.length}
                  page={revenuePage}
                  onPageChange={handleRevenueChangePage}
                  rowsPerPage={revenueRowsPerPage}
                  onRowsPerPageChange={handleRevenueChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 25, { label: 'Tất cả', value: -1 }]}
                  labelRowsPerPage="Hàng mỗi trang:"
                  labelDisplayedRows={({ from, to, count }) => `${from}-${to} trong số ${count}`}
                />
              </TableContainer>
            )}
          </Paper>
        </Grid>

        {/* Bảng Bài viết có lượt xem cao nhất */}
        <Grid item xs={12} md={6}> {/* Dùng md={6} để chia đôi màn hình trên desktop */}
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Bài viết có lượt xem cao nhất
            </Typography>
            {mostViewedPosts.length === 0 ? (
              <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                Chưa có dữ liệu bài viết có lượt xem cao nhất để hiển thị.
              </Typography>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID Bài viết</TableCell>
                      <TableCell>Tiêu đề Bài viết</TableCell>
                      <TableCell align="right">Lượt xem</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(postsRowsPerPage > 0
                      ? mostViewedPosts.slice(postsPage * postsRowsPerPage, postsPage * postsRowsPerPage + postsRowsPerPage)
                      : mostViewedPosts
                    ).map((post) => (
                      <TableRow key={post.newsId}>
                        <TableCell>{post.newsId}</TableCell>
                        <TableCell sx={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {post.newsTitle}
                        </TableCell>
                        <TableCell align="right">{post.views.toLocaleString('vi-VN')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <TablePagination
                  component="div"
                  count={mostViewedPosts.length}
                  page={postsPage}
                  onPageChange={handlePostsChangePage}
                  rowsPerPage={postsRowsPerPage}
                  onRowsPerPageChange={handlePostsChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 25, { label: 'Tất cả', value: -1 }]}
                  labelRowsPerPage="Hàng mỗi trang:"
                  labelDisplayedRows={({ from, to, count }) => `${from}-${to} trong số ${count}`}
                />
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Statistics;