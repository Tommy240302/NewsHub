import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleIcon from '@mui/icons-material/Article';
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240; 

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken'); 
    navigate('/admin/login'); 
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <DashboardIcon /> },
    { name: 'Quản lý Bài viết', path: '/admin/posts', icon: <ArticleIcon /> },
    { name: 'Quản lý Người dùng', path: '/admin/users', icon: <GroupIcon /> },
    
  ];

  return (
    <Box
      component="nav"
      sx={{
        width: { sm: drawerWidth },
        flexShrink: { sm: 0 },
        height: '100vh',
        backgroundColor: '#2c3e50',
        color: 'white',
      }}
    >
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', mb: 2 }}>
          NewsHub Admin
        </Typography>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.3)' }} />
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderLeft: '4px solid #3498db',
                  color: '#3498db',
                  '& .MuiListItemIcon-root': {
                    color: '#3498db',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.08)',
                },
                color: 'white',
              }}
              selected={location.pathname === item.path || (item.path === '/admin/dashboard' && location.pathname === '/admin')}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.3)', mt: 'auto' }} /> {/* Pushes logout to bottom */}
      <List sx={{ mt: 'auto' }}>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout} sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' } }}>
            <ListItemIcon sx={{ color: 'white' }}><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Đăng xuất" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

export default AdminSidebar;