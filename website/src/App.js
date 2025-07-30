import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, CircularProgress, Box } from '@mui/material';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Import store
import { store } from './store/store';

// Import i18n
import './i18n/i18n';

// Import components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Import pages (lazy loaded)
const HomePage = React.lazy(() => import('./pages/HomePage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const FeaturesPage = React.lazy(() => import('./pages/FeaturesPage'));
const HowItWorksPage = React.lazy(() => import('./pages/HowItWorksPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const PrivacyPage = React.lazy(() => import('./pages/PrivacyPage'));
const TermsPage = React.lazy(() => import('./pages/TermsPage'));

// Admin Dashboard (lazy loaded)
const AdminLogin = React.lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAdminAuthenticated = localStorage.getItem('adminToken');
  return isAdminAuthenticated ? children : <Navigate to="/admin/login" />;
};

// Loading Component
const LoadingSpinner = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="60vh"
  >
    <CircularProgress size={60} sx={{ color: '#3498DB' }} />
  </Box>
);

// Theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: '#3498DB',
      light: '#5DADE2',
      dark: '#2980B9',
    },
    secondary: {
      main: '#2ECC71',
      light: '#58D68D',
      dark: '#27AE60',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F8F9FA',
    },
    text: {
      primary: '#2C3E50',
      secondary: '#7F8C8D',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: '2.75rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '2.25rem',
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.75rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.5rem',
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 25,
          padding: '12px 32px',
          fontSize: '1rem',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

function App() {
  // Initialize AOS
  React.useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
    });
  }, []);
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <ScrollToTop />
          <div className="App">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Marketing Website Routes */}
                <Route
                  path="/*"
                  element={
                    <>
                      <Navbar />
                      <main>
                        <Routes>
                          <Route path="/" element={<HomePage />} />
                          <Route path="/about" element={<AboutPage />} />
                          <Route path="/features" element={<FeaturesPage />} />
                          <Route path="/how-it-works" element={<HowItWorksPage />} />
                          <Route path="/contact" element={<ContactPage />} />
                          <Route path="/privacy" element={<PrivacyPage />} />
                          <Route path="/terms" element={<TermsPage />} />
                        </Routes>
                      </main>
                      <Footer />
                    </>
                  }
                />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Suspense>
          </div>

          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                style: {
                  background: '#2ECC71',
                },
              },
              error: {
                style: {
                  background: '#E74C3C',
                },
              },
            }}
          />
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;