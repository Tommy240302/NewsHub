import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';

const DashboardAdmin = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard Admin
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Chào mừng trở lại bảng điều khiển quản trị của NewsHub!
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6">Tổng số bài viết</Typography>
            <Typography variant="h3" color="primary">120</Typography> {/* Dữ liệu giả */}
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6">Tổng số người dùng</Typography>
            <Typography variant="h3" color="secondary">50</Typography> {/* Dữ liệu giả */}
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6">Bài viết mới hôm nay</Typography>
            <Typography variant="h3" color="success.main">5</Typography> {/* Dữ liệu giả */}
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Hoạt động gần đây
        </Typography>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="body2">
            - User Dainguyen đã đăng ký.
          </Typography>
          <Typography variant="body2">
            - Bài viết Tiêu đề bài viết mới đã được tạo.
          </Typography>
          <Typography variant="body2">
            - Tác giả David đã đăng 1 bài viết mới.
          </Typography>
          {/* có thể lấy dữ liệu hoạt động thực tế từ API */}
        </Paper>
      </Box>
    </Box>
  );
};

export default DashboardAdmin;