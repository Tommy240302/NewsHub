import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Box,
  CssBaseline,
  Button,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PeopleIcon from '@mui/icons-material/People';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import BarChartIcon from '@mui/icons-material/BarChart';

const drawerWidth = 240;

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const drawer = (
    <div>
      <Box
        sx={{
          height: 64, 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          p: 2, 
          cursor: 'pointer', 
        }}
        onClick={() => navigate('/admin/dashboard')} 
      >
        <Typography variant="h6" noWrap>
          Admin Home
        </Typography>
      </Box>
      <List>
        {/* Mục Dashboard */}
        <ListItem disablePadding>
          <Button
            fullWidth
            sx={{
              justifyContent: 'flex-start',
              py: 1.5,
              px: 2,
              color: location.pathname === '/admin' || location.pathname === '/admin/dashboard'
                      ? theme.palette.primary.main 
                      : theme.palette.text.secondary, 
              '&:hover': {
                backgroundColor: theme.palette.action.hover, 
                color: theme.palette.primary.main, 
              },
              backgroundColor:
                location.pathname === '/admin' || location.pathname === '/admin/dashboard'
                  ? theme.palette.action.selected 
                  : 'transparent',
            }}
            onClick={() => navigate('/admin/dashboard')}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </Button>
        </ListItem>

        {/* Mục Quản lý Bài viết */}
        <ListItem disablePadding>
          <Button
            fullWidth
            sx={{
              justifyContent: 'flex-start',
              py: 1.5,
              px: 2,
              color: location.pathname === '/admin/posts'
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                color: theme.palette.primary.main,
              },
              backgroundColor:
                location.pathname === '/admin/posts'
                  ? theme.palette.action.selected
                  : 'transparent',
            }}
            onClick={() => navigate('/admin/posts')}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
              <PostAddIcon />
            </ListItemIcon>
            <ListItemText primary="Quản lý Bài viết" />
          </Button>
        </ListItem>

        {/* Mục Quản lý Người dùng */}
        <ListItem disablePadding>
          <Button
            fullWidth
            sx={{
              justifyContent: 'flex-start',
              py: 1.5,
              px: 2,
              color: location.pathname === '/admin/users'
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                color: theme.palette.primary.main,
              },
              backgroundColor:
                location.pathname === '/admin/users'
                  ? theme.palette.action.selected
                  : 'transparent',
            }}
            onClick={() => navigate('/admin/users')}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Quản lý Người dùng" />
          </Button>
        </ListItem>

        {/* Mục Thống kê */}
        <ListItem disablePadding>
          <Button
            fullWidth
            sx={{
              justifyContent: 'flex-start',
              py: 1.5,
              px: 2,
              color: location.pathname === '/admin/statistics'
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                color: theme.palette.primary.main,
              },
              backgroundColor:
                location.pathname === '/admin/statistics'
                  ? theme.palette.action.selected
                  : 'transparent',
            }}
            onClick={() => navigate('/admin/statistics')}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
              <BarChartIcon />
            </ListItemIcon>
            <ListItemText primary="Thống kê" />
          </Button>
        </ListItem>

        {/* Mục Đăng xuất */}
        <ListItem disablePadding>
          <Button
            fullWidth
            sx={{
              justifyContent: 'flex-start',
              py: 1.5,
              px: 2,
              color: theme.palette.text.secondary,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                color: theme.palette.primary.main,
              },
            }}
            onClick={handleLogout}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Đăng xuất" />
          </Button>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: theme.palette.primary.main,
          boxShadow: theme.shadows[3], 
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar /> 
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;