/**
 * Layout Component
 * 
 * Main layout wrapper for the authenticated application.
 * Provides:
 * - Responsive navigation drawer/sidebar
 * - App bar with menu toggle and title
 * - Navigation menu with route highlighting
 * - User authentication controls
 * - Mobile-responsive design
 * - Theme-aware styling with gradients
 */

import React, { ReactNode } from 'react';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore, useThemeStore } from '../stores';

// Sidebar width constant for consistent spacing
const drawerWidth = 240;

interface LayoutProps {
  children: ReactNode; // Page content to render inside the layout
}

/**
 * Layout Component
 * 
 * Responsive layout with sidebar navigation and app bar.
 * Handles mobile/desktop navigation patterns and theme integration.
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  // State for mobile drawer open/close
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Material-UI hooks for responsive design
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Navigation and authentication
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuthStore();
  const { colorScheme } = useThemeStore();

  /**
   * Toggle mobile drawer open/close state
   */
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  /**
   * Handle user logout
   * Clears authentication and redirects to login page
   */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  /**
   * Navigation menu items configuration
   * Each item has text, icon, and route path
   */
  const menuItems = [
    { text: 'Overview', icon: <HomeIcon />, path: '/' },
    { text: 'Search', icon: <SearchIcon />, path: '/search' },
    { text: 'Nutrition', icon: <AnalyticsIcon />, path: '/nutrition' },
    { text: 'Grocery List', icon: <ListAltIcon />, path: '/two-week-ingredients' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    { text: 'Admin', icon: <AdminPanelSettingsIcon />, path: '/admin' },
  ];

  /**
   * Drawer content component
   * Contains the navigation menu with theme-aware styling
   */
  const drawer = (
    <Box
      sx={{
        background: colorScheme?.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
        height: '100%',
        color: colorScheme?.mode === 'dark' ? 'white' : 'text.primary',
        overflow: 'hidden', // Remove scrollbar for clean look
      }}
    >
      {/* Sidebar header with app branding */}
      <Toolbar
        sx={{
          background: colorScheme?.gradients?.sidebarHeader 
            ? `linear-gradient(135deg, ${colorScheme.gradients.sidebarHeader.from} 0%, ${colorScheme.gradients.sidebarHeader.to} 100%)`
            : 'linear-gradient(135deg, #667eea 0%, #5a67d8 100%)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          color: 'white',
        }}
      >
        <Typography 
          variant="h6" 
          noWrap 
          component="div"
          sx={{
            fontWeight: 'bold',
            textShadow: '0 1px 2px rgba(0,0,0,0.2)',
          }}
        >
          Recipe Map
        </Typography>
      </Toolbar>
      
      {/* Navigation menu items */}
      <List sx={{ pt: 2, overflow: 'hidden' }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1, mx: 1 }}>
            <ListItemButton
              selected={location.pathname === item.path} // Highlight current route
              onClick={() => {
                navigate(item.path);
                // Close mobile drawer after navigation
                if (isMobile) {
                  setMobileOpen(false);
                }
              }}
              sx={{
                borderRadius: '8px 0 0 8px', // Remove right border radius
                background: location.pathname === item.path 
                  ? (colorScheme?.gradients?.sidebarHeader 
                    ? `linear-gradient(135deg, ${colorScheme.gradients.sidebarHeader.from} 0%, ${colorScheme.gradients.sidebarHeader.to} 100%)`
                    : 'linear-gradient(135deg, #667eea 0%, #5a67d8 100%)')
                  : 'transparent',
                color: location.pathname === item.path ? 'white' : 'inherit',
                '&:hover': {
                  background: location.pathname === item.path
                    ? (colorScheme?.gradients?.sidebarHeader 
                      ? `linear-gradient(135deg, ${colorScheme.gradients.sidebarHeader.from} 0%, ${colorScheme.gradients.sidebarHeader.to} 100%)`
                      : 'linear-gradient(135deg, #667eea 0%, #5a67d8 100%)')
                    : colorScheme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                },
                transition: 'all 0.3s ease',
                boxShadow: location.pathname === item.path 
                  ? '0 2px 8px rgba(102, 126, 234, 0.3)'
                  : 'none',
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding sx={{ mt: 3, mx: 1 }}>
          <ListItemButton 
            onClick={handleLogout}
            sx={{
              borderRadius: '8px 0 0 8px', // Remove right border radius
              background: colorScheme?.gradients?.sidebarHeader 
                ? `linear-gradient(135deg, ${colorScheme.gradients.sidebarHeader.from} 0%, ${colorScheme.gradients.sidebarHeader.to} 100%)`
                : 'linear-gradient(135deg, #667eea 0%, #5a67d8 100%)',
              color: 'white',
              '&:hover': {
                background: colorScheme?.gradients?.sidebarHeader 
                  ? `linear-gradient(135deg, ${colorScheme.gradients.sidebarHeader.to} 0%, ${colorScheme.gradients.sidebarHeader.from} 100%)`
                  : 'linear-gradient(135deg, #5a67d8 0%, #667eea 100%)',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Logout"
              sx={{
                '& .MuiListItemText-primary': {
                  fontWeight: 'bold',
                }
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: colorScheme?.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
          color: colorScheme?.mode === 'dark' ? 'white' : 'text.primary',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { md: 'none' },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 'normal',
            }}
          >
            Welcome back, {user?.username}! 👋
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              background: colorScheme.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
              color: colorScheme.mode === 'dark' ? 'white' : 'text.primary',
              overflow: 'hidden', // Remove scrollbar
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              background: colorScheme.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
              color: colorScheme.mode === 'dark' ? 'white' : 'text.primary',
              borderRight: `1px solid ${colorScheme.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
              overflow: 'hidden', // Remove scrollbar
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
          width: { md: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: 'background.default',
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
