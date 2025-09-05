/**
 * Login Page Component
 * 
 * Authentication interface supporting both login and registration.
 * Features:
 * - Tabbed interface for login/registration switching
 * - Comprehensive user registration with profile information
 * - Form validation and error handling
 * - Responsive design for mobile and desktop
 * - Integration with authentication store and API
 * 
 * Registration includes:
 * - Basic credentials (username, email, password)
 * - Physical attributes (weight, height, age)
 * - Activity level selection
 * - Goal setting for nutrition tracking
 * 
 * @component
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  Alert,
  Tab,
  Tabs,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../services/auth';
import { useAuthStore } from '../stores';
import { LoginRequest, RegisterRequest } from '../types';
import { api } from '../services/api';

/**
 * Tab panel props for login/register tabs
 */
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const LoginPage: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [loginData, setLoginData] = useState<LoginRequest>({
    username: '',
    password: '',
  });
  const [registerData, setRegisterData] = useState<RegisterRequest>({
    username: '',
    email: '',
    password: '',
    weight: undefined,
    height: undefined,
    age: undefined,
    gender: undefined,
    activity_level: 1.5,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuthStore();

  // Test backend connectivity when component loads
  useEffect(() => {
    const testBackendConnectivity = async () => {
      console.log('🔍 Testing backend connectivity...');
      console.log('API Base URL:', import.meta.env.VITE_API_URL || 'http://localhost:3001/api');
      
      try {
        // Test health endpoint
        const healthResponse = await api.get('/health');
        console.log('✅ Backend Health Check:', healthResponse.data);
        
        // Test if token exists in localStorage
        const token = localStorage.getItem('token');
        console.log('🔑 Token in localStorage:', !!token);
        
        if (token) {
          console.log('🔑 Token preview:', token.substring(0, 20) + '...');
        }
        
      } catch (error: any) {
        console.error('❌ Backend connectivity test failed:', error);
        console.error('❌ Error details:', {
          message: error.message,
          code: error.code,
          response: error.response?.data,
          status: error.response?.status
        });
        
        if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
          setError('Cannot connect to backend server. Please check if the server is running.');
        }
      }
    };

    testBackendConnectivity();
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await authService.login(loginData);
      login(result.user, result.token);
      toast.success('Login successful!');
      navigate('/');
    } catch (err: any) {
      const message = err.response?.data?.error || 'Login failed';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await authService.register(registerData);
      login(result.user, result.token);
      toast.success('Registration successful!');
      navigate('/');
    } catch (err: any) {
      const message = err.response?.data?.error || 'Registration failed';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Card sx={{ width: '100%' }}>
          <CardContent>
            <Typography component="h1" variant="h4" align="center" gutterBottom>
              Nutrient Tracker
            </Typography>
            
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs value={tab} onChange={handleTabChange} centered>
                <Tab label="Login" />
                <Tab label="Register" />
              </Tabs>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TabPanel value={tab} index={0}>
              <Box component="form" onSubmit={handleLogin}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Username"
                  autoComplete="username"
                  autoFocus
                  value={loginData.username}
                  onChange={(e) =>
                    setLoginData({ ...loginData, username: e.target.value })
                  }
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
                <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary" align="center">
                    <strong>Default Login:</strong><br />
                    Username: admin<br />
                    Password: admin123
                  </Typography>
                </Box>
              </Box>
            </TabPanel>

            <TabPanel value={tab} index={1}>
              <Box component="form" onSubmit={handleRegister}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Username"
                      autoComplete="username"
                      value={registerData.username}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, username: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Email"
                      type="email"
                      autoComplete="email"
                      value={registerData.email}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, email: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Password"
                      type="password"
                      autoComplete="new-password"
                      value={registerData.password}
                      onChange={(e) =>
                        setRegisterData({ ...registerData, password: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Weight (kg)"
                      type="number"
                      value={registerData.weight || ''}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          weight: e.target.value ? parseFloat(e.target.value) : undefined,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Height (cm)"
                      type="number"
                      value={registerData.height || ''}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          height: e.target.value ? parseFloat(e.target.value) : undefined,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Age"
                      type="number"
                      value={registerData.age || ''}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          age: e.target.value ? parseInt(e.target.value) : undefined,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel>Gender</InputLabel>
                      <Select
                        value={registerData.gender || ''}
                        label="Gender"
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            gender: e.target.value as any,
                          })
                        }
                      >
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={loading}
                >
                  {loading ? 'Registering...' : 'Register'}
                </Button>
              </Box>
            </TabPanel>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default LoginPage;
