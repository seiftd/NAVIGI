import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Fab,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  Videocam,
  Poll,
  AccountBalanceWallet,
  EmojiEvents,
  Notifications,
  Settings,
  Logout,
  Add,
  Edit,
  Delete,
  CheckCircle,
  Cancel,
  TrendingUp,
  AttachMoney,
  Group,
  Campaign
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate, Routes, Route } from 'react-router-dom';

const drawerWidth = 240;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('dashboard');

  // Sample data
  const [stats, setStats] = useState({
    totalUsers: 10847,
    activeUsers: 8239,
    totalEarnings: 52490,
    totalWithdrawals: 35600,
    adsWatched: 156743,
    surveysCompleted: 12847
  });

  const [ads, setAds] = useState([
    {
      id: 1,
      title: 'Product Advertisement',
      type: 'Rewarded Video',
      points: 10,
      duration: 30,
      status: 'Active',
      views: 2450,
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      title: 'Service Promotion',
      type: 'Interstitial',
      points: 15,
      duration: 15,
      status: 'Paused',
      views: 1820,
      createdAt: '2024-01-14'
    }
  ]);

  const [surveys, setSurveys] = useState([
    {
      id: 1,
      title: 'Customer Satisfaction Survey',
      points: 25,
      questions: 10,
      duration: 5,
      status: 'Active',
      responses: 847,
      createdAt: '2024-01-12'
    },
    {
      id: 2,
      title: 'Product Feedback Survey',
      points: 20,
      questions: 8,
      duration: 4,
      status: 'Active',
      responses: 632,
      createdAt: '2024-01-10'
    }
  ]);

  const [withdrawals, setWithdrawals] = useState([
    {
      id: 1,
      userId: 'user123',
      userName: 'Ahmed Mohamed',
      method: 'Binance Pay',
      amount: 50,
      points: 500,
      status: 'Pending',
      requestedAt: '2024-01-15 14:30',
      email: 'ahmed@example.com'
    },
    {
      id: 2,
      userId: 'user456',
      userName: 'Fatima Ali',
      method: 'BaridiMob',
      amount: 35,
      points: 350,
      status: 'Approved',
      requestedAt: '2024-01-15 12:15',
      phone: '+213555123456'
    }
  ]);

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, key: 'dashboard' },
    { text: 'Users', icon: <People />, key: 'users' },
    { text: 'Ad Management', icon: <Videocam />, key: 'ads' },
    { text: 'Survey Management', icon: <Poll />, key: 'surveys' },
    { text: 'Withdrawals', icon: <AccountBalanceWallet />, key: 'withdrawals' },
    { text: 'Contests', icon: <EmojiEvents />, key: 'contests' },
    { text: 'Notifications', icon: <Notifications />, key: 'notifications' },
    { text: 'Settings', icon: <Settings />, key: 'settings' }
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  // Ad Management Dialog
  const [adDialog, setAdDialog] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [adForm, setAdForm] = useState({
    title: '',
    type: 'Rewarded Video',
    points: 10,
    duration: 30,
    videoUrl: '',
    description: ''
  });

  // Survey Management Dialog
  const [surveyDialog, setSurveyDialog] = useState(false);
  const [editingSurvey, setEditingSurvey] = useState(null);
  const [surveyForm, setSurveyForm] = useState({
    title: '',
    points: 20,
    duration: 5,
    questions: []
  });

  const handleAddAd = () => {
    setEditingAd(null);
    setAdForm({
      title: '',
      type: 'Rewarded Video',
      points: 10,
      duration: 30,
      videoUrl: '',
      description: ''
    });
    setAdDialog(true);
  };

  const handleEditAd = (ad) => {
    setEditingAd(ad);
    setAdForm(ad);
    setAdDialog(true);
  };

  const handleSaveAd = () => {
    if (editingAd) {
      setAds(ads.map(ad => ad.id === editingAd.id ? { ...ad, ...adForm } : ad));
    } else {
      const newAd = {
        id: Date.now(),
        ...adForm,
        status: 'Active',
        views: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setAds([...ads, newAd]);
    }
    setAdDialog(false);
  };

  const handleDeleteAd = (adId) => {
    setAds(ads.filter(ad => ad.id !== adId));
  };

  const handleAddSurvey = () => {
    setEditingSurvey(null);
    setSurveyForm({
      title: '',
      points: 20,
      duration: 5,
      questions: []
    });
    setSurveyDialog(true);
  };

  const handleSaveSurvey = () => {
    if (editingSurvey) {
      setSurveys(surveys.map(survey => 
        survey.id === editingSurvey.id ? { ...survey, ...surveyForm } : survey
      ));
    } else {
      const newSurvey = {
        id: Date.now(),
        ...surveyForm,
        questions: surveyForm.questions.length || 5,
        status: 'Active',
        responses: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setSurveys([...surveys, newSurvey]);
    }
    setSurveyDialog(false);
  };

  const handleApproveWithdrawal = (withdrawalId) => {
    setWithdrawals(withdrawals.map(w => 
      w.id === withdrawalId ? { ...w, status: 'Approved' } : w
    ));
  };

  const handleRejectWithdrawal = (withdrawalId) => {
    setWithdrawals(withdrawals.map(w => 
      w.id === withdrawalId ? { ...w, status: 'Rejected' } : w
    ));
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ color: '#3498DB' }}>
          NAVIGI Admin
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.key} disablePadding>
            <ListItemButton
              selected={currentSection === item.key}
              onClick={() => setCurrentSection(item.key)}
            >
              <ListItemIcon sx={{ color: currentSection === item.key ? '#3498DB' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  const renderContent = () => {
    switch (currentSection) {
      case 'dashboard':
        return (
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Dashboard Overview
            </Typography>
            
            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={2}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center">
                      <Group sx={{ color: '#3498DB', mr: 1 }} />
                      <Box>
                        <Typography color="text.secondary" gutterBottom>
                          Total Users
                        </Typography>
                        <Typography variant="h5">
                          {stats.totalUsers.toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center">
                      <TrendingUp sx={{ color: '#2ECC71', mr: 1 }} />
                      <Box>
                        <Typography color="text.secondary" gutterBottom>
                          Active Users
                        </Typography>
                        <Typography variant="h5">
                          {stats.activeUsers.toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center">
                      <AttachMoney sx={{ color: '#F39C12', mr: 1 }} />
                      <Box>
                        <Typography color="text.secondary" gutterBottom>
                          Total Earnings
                        </Typography>
                        <Typography variant="h5">
                          ${stats.totalEarnings.toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center">
                      <AccountBalanceWallet sx={{ color: '#E74C3C', mr: 1 }} />
                      <Box>
                        <Typography color="text.secondary" gutterBottom>
                          Withdrawals
                        </Typography>
                        <Typography variant="h5">
                          ${stats.totalWithdrawals.toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center">
                      <Videocam sx={{ color: '#9B59B6', mr: 1 }} />
                      <Box>
                        <Typography color="text.secondary" gutterBottom>
                          Ads Watched
                        </Typography>
                        <Typography variant="h5">
                          {stats.adsWatched.toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center">
                      <Poll sx={{ color: '#16A085', mr: 1 }} />
                      <Box>
                        <Typography color="text.secondary" gutterBottom>
                          Surveys Done
                        </Typography>
                        <Typography variant="h5">
                          {stats.surveysCompleted.toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        );

      case 'ads':
        return (
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
              <Typography variant="h4" gutterBottom>
                Ad Management
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddAd}
              >
                Add New Ad
              </Button>
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Points</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Views</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ads.map((ad) => (
                    <TableRow key={ad.id}>
                      <TableCell>{ad.title}</TableCell>
                      <TableCell>{ad.type}</TableCell>
                      <TableCell>{ad.points} points</TableCell>
                      <TableCell>{ad.duration}s</TableCell>
                      <TableCell>
                        <Chip 
                          label={ad.status}
                          color={ad.status === 'Active' ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{ad.views}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEditAd(ad)} size="small">
                          <Edit />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteAd(ad.id)} size="small">
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Container>
        );

      case 'surveys':
        return (
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
              <Typography variant="h4" gutterBottom>
                Survey Management
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddSurvey}
              >
                Add New Survey
              </Button>
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Points</TableCell>
                    <TableCell>Questions</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Responses</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {surveys.map((survey) => (
                    <TableRow key={survey.id}>
                      <TableCell>{survey.title}</TableCell>
                      <TableCell>{survey.points} points</TableCell>
                      <TableCell>{survey.questions}</TableCell>
                      <TableCell>{survey.duration} min</TableCell>
                      <TableCell>
                        <Chip 
                          label={survey.status}
                          color={survey.status === 'Active' ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{survey.responses}</TableCell>
                      <TableCell>
                        <IconButton size="small">
                          <Edit />
                        </IconButton>
                        <IconButton size="small">
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Container>
        );

      case 'withdrawals':
        return (
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Withdrawal Management
            </Typography>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Method</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Points</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {withdrawals.map((withdrawal) => (
                    <TableRow key={withdrawal.id}>
                      <TableCell>{withdrawal.userName}</TableCell>
                      <TableCell>{withdrawal.method}</TableCell>
                      <TableCell>${withdrawal.amount}</TableCell>
                      <TableCell>{withdrawal.points}</TableCell>
                      <TableCell>
                        <Chip 
                          label={withdrawal.status}
                          color={
                            withdrawal.status === 'Approved' ? 'success' :
                            withdrawal.status === 'Pending' ? 'warning' : 'error'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{withdrawal.requestedAt}</TableCell>
                      <TableCell>
                        {withdrawal.status === 'Pending' && (
                          <>
                            <IconButton 
                              onClick={() => handleApproveWithdrawal(withdrawal.id)}
                              size="small"
                              color="success"
                            >
                              <CheckCircle />
                            </IconButton>
                            <IconButton 
                              onClick={() => handleRejectWithdrawal(withdrawal.id)}
                              size="small"
                              color="error"
                            >
                              <Cancel />
                            </IconButton>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Container>
        );

      default:
        return (
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              {currentSection.charAt(0).toUpperCase() + currentSection.slice(1)}
            </Typography>
            <Typography>
              This section is under development.
            </Typography>
          </Container>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
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
          <Typography variant="h6" noWrap component="div">
            NAVIGI Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
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
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        {renderContent()}
      </Box>

      {/* Add Ad Dialog */}
      <Dialog open={adDialog} onClose={() => setAdDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingAd ? 'Edit Ad' : 'Add New Ad'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ad Title"
                value={adForm.title}
                onChange={(e) => setAdForm({ ...adForm, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Ad Type</InputLabel>
                <Select
                  value={adForm.type}
                  onChange={(e) => setAdForm({ ...adForm, type: e.target.value })}
                >
                  <MenuItem value="Rewarded Video">Rewarded Video</MenuItem>
                  <MenuItem value="Interstitial">Interstitial</MenuItem>
                  <MenuItem value="Banner">Banner</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Points Reward"
                value={adForm.points}
                onChange={(e) => setAdForm({ ...adForm, points: parseInt(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Duration (seconds)"
                value={adForm.duration}
                onChange={(e) => setAdForm({ ...adForm, duration: parseInt(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Video URL"
                value={adForm.videoUrl}
                onChange={(e) => setAdForm({ ...adForm, videoUrl: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={adForm.description}
                onChange={(e) => setAdForm({ ...adForm, description: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAdDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveAd} variant="contained">
            {editingAd ? 'Update' : 'Add'} Ad
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Survey Dialog */}
      <Dialog open={surveyDialog} onClose={() => setSurveyDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingSurvey ? 'Edit Survey' : 'Add New Survey'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Survey Title"
                value={surveyForm.title}
                onChange={(e) => setSurveyForm({ ...surveyForm, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="Points Reward"
                value={surveyForm.points}
                onChange={(e) => setSurveyForm({ ...surveyForm, points: parseInt(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="Duration (minutes)"
                value={surveyForm.duration}
                onChange={(e) => setSurveyForm({ ...surveyForm, duration: parseInt(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="Number of Questions"
                value={surveyForm.questions.length || 5}
                onChange={(e) => setSurveyForm({ ...surveyForm, questions: Array(parseInt(e.target.value)).fill('') })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSurveyDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveSurvey} variant="contained">
            {editingSurvey ? 'Update' : 'Add'} Survey
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;