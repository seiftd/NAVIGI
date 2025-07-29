import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Admin, Lock } from '@mui/icons-material';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check credentials
    if (
      credentials.email === 'seiftouatllol@gmail.com' && 
      credentials.password === 'seif0662'
    ) {
      // Store admin token
      localStorage.setItem('adminToken', 'admin-authenticated');
      navigate('/admin');
    } else {
      setError('Invalid email or password');
    }
    
    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #3498DB 0%, #2ECC71 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={10} sx={{ p: 4, borderRadius: 4 }}>
          <Box textAlign="center" mb={4}>
            <Admin sx={{ fontSize: 60, color: '#3498DB', mb: 2 }} />
            <Typography variant="h4" gutterBottom fontWeight="bold">
              NAVIGI Admin
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to access the admin dashboard
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              sx={{ mb: 3 }}
              required
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              sx={{ mb: 4 }}
              required
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ 
                py: 2,
                fontSize: '1.1rem',
                background: 'linear-gradient(45deg, #3498DB 30%, #2ECC71 90%)'
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <Box mt={3} textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Admin Email: seiftouatllol@gmail.com
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminLogin;