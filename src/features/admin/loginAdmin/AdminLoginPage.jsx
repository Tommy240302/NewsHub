import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Link as MuiLink // Đổi tên Link của Material-UI để tránh xung đột
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AdminAuthService from './AdminAuthService'; // <-- Service xử lý logic đăng nhập

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    console.log('AdminLoginPage: Bắt đầu quá trình đăng nhập...');
    try {
      const loginResult = await AdminAuthService.login(email, password);
      console.log('AdminLoginPage: AdminAuthService.login thành công. Kết quả:', loginResult);
      
      // Đăng nhập thành công, chuyển hướng đến trang dashboard admin
      console.log('AdminLoginPage: Đang cố gắng chuyển hướng đến /admin/dashboard...');
      navigate('/admin/dashboard');
      console.log('AdminLoginPage: Lệnh navigate đã được gọi.'); // Dòng này sẽ chỉ chạy nếu navigate không ném lỗi đồng bộ
    } catch (err) {
      const errorMessage = err.response?.data?.errorMessage || err.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
      setError(errorMessage);
      console.error('AdminLoginPage: Lỗi đăng nhập:', err);
    } finally {
      setLoading(false);
      console.log('AdminLoginPage: Quá trình đăng nhập kết thúc (loading = false).');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
      }}
    >
      <Paper elevation={6} sx={{ p: 4, maxWidth: 400, width: '100%', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <LockOutlinedIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }}>
            Đăng nhập Admin
          </Typography>
        </Box>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleLogin}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Địa chỉ Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            size="small"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Mật khẩu"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            size="small"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 'bold' }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Đăng nhập'}
          </Button>
        </form>
        <Typography variant="body2" color="text.secondary" align="center">
          <MuiLink href="/login" variant="body2">
            Bạn không phải là Admin? Đăng nhập tại đây.
          </MuiLink>
        </Typography>
      </Paper>
    </Box>
  );
};

export default AdminLoginPage;
