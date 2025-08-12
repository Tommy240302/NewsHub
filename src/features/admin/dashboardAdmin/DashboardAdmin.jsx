import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card, // Import Card để dùng cho các thẻ tóm tắt
  CardContent, // Import CardContent
  CircularProgress, // Import để hiển thị trạng thái tải
  Alert, // Import để hiển thị lỗi
  List, // Thêm import List
  ListItem, // Thêm import ListItem
  ListItemIcon, // Thêm import ListItemIcon
  ListItemText // Thêm import ListItemText
} from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article'; // Icon cho Tổng số bài viết
import PeopleIcon from '@mui/icons-material/People'; // Icon cho Tổng số người dùng
import TodayIcon from '@mui/icons-material/Today'; // Icon cho Bài viết mới hôm nay
import PersonAddIcon from '@mui/icons-material/PersonAdd'; // Icon cho Người dùng mới hôm nay
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'; // Icon cho Hoạt động gần đây

import apiClient from '../../../api/apiClient'; // Đảm bảo đường dẫn import đúng đến apiClient của bạn

const DashboardAdmin = () => {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardSummary = async () => {
      try {
        setLoading(true);
        setError(null);
        // Gọi API để lấy dữ liệu tổng quan dashboard
        const response = await apiClient.get('/admin/dashboard/summary');
        // Kiểm tra cấu trúc phản hồi dựa trên Swagger UI bạn cung cấp
        if (response.data && response.data.data) {
          setSummaryData(response.data.data); // Cập nhật state với dữ liệu thực tế
        } else {
          setError('Cấu trúc dữ liệu tổng quan dashboard không hợp lệ.');
          console.error("Dashboard: Cấu trúc dữ liệu tổng quan không đúng:", response.data);
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Không rõ nguyên nhân.';
        setError('Không thể tải dữ liệu tổng quan: ' + errorMessage);
        console.error("Dashboard: Lỗi khi lấy dữ liệu tổng quan:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardSummary();
  }, []); // [] đảm bảo chỉ chạy một lần khi component được mount

  // Hiển thị trạng thái tải hoặc lỗi
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px" sx={{ p: 3 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Đang tải dữ liệu dashboard...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard Admin
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
        Chào mừng trở lại bảng điều khiển quản trị của NewsHub!
      </Typography>

      {/* Thẻ tóm tắt - Sử dụng Card thay vì Paper để hiển thị đẹp hơn */}
      <Grid container spacing={3}>
        {/* Tổng số bài viết */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <ArticleIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" color="text.secondary">
                  Tổng số bài viết
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {summaryData?.totalNewsCount?.toLocaleString() || 'N/A'} {/* Lấy dữ liệu từ API */}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Tổng số người dùng */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <PeopleIcon color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h6" color="text.secondary">
                  Tổng số người dùng
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                {summaryData?.totalUserCount?.toLocaleString() || 'N/A'} {/* Lấy dữ liệu từ API */}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Bài viết mới hôm nay */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <TodayIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6" color="text.secondary">
                  Bài viết mới hôm nay
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                {summaryData?.newsCountToday?.toLocaleString() || 'N/A'} {/* Lấy dữ liệu từ API */}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Người dùng mới hôm nay */}
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <PersonAddIcon color="info" sx={{ mr: 1 }} />
                <Typography variant="h6" color="text.secondary">
                  Người dùng mới hôm nay
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                {summaryData?.userCountToday?.toLocaleString() || 'N/A'} {/* Lấy dữ liệu từ API */}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Hoạt động gần đây */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Hoạt động gần đây
        </Typography>
        <Paper elevation={3} sx={{ p: 3 }}>
          {summaryData?.recentActivities && summaryData.recentActivities.length > 0 ? (
            <List>
              {summaryData.recentActivities.map((activity, index) => (
                <ListItem key={index}>
                  <ListItemIcon sx={{ minWidth: 'auto', mr: 1 }}>
                    <FiberManualRecordIcon sx={{ fontSize: 'small', color: 'text.secondary' }} />
                  </ListItemIcon>
                  <ListItemText primary={activity} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Không có hoạt động gần đây để hiển thị.
            </Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default DashboardAdmin;
