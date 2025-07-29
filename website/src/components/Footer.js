import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Email,
  Phone,
  LocationOn,
  AdminPanelSettings
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#2C3E50',
        color: 'white',
        py: 6,
        mt: 8
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{ 
                color: '#3498DB', 
                fontWeight: 'bold',
                textAlign: isArabic ? 'right' : 'left',
                direction: isArabic ? 'rtl' : 'ltr'
              }}
            >
              NAVIGI
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                mb: 2,
                textAlign: isArabic ? 'right' : 'left',
                direction: isArabic ? 'rtl' : 'ltr'
              }}
            >
              {isArabic 
                ? 'تطبيق نافيجي - اربح المال من مشاهدة الإعلانات وإحالة الأصدقاء. طريقك السهل لكسب دخل إضافي آمن وموثوق.'
                : 'NAVIGI App - Earn money by watching ads and referring friends. Your easy path to safe and reliable extra income.'
              }
            </Typography>
            
            {/* Social Media */}
            <Box>
              <IconButton sx={{ color: '#3498DB' }}>
                <Facebook />
              </IconButton>
              <IconButton sx={{ color: '#3498DB' }}>
                <Twitter />
              </IconButton>
              <IconButton sx={{ color: '#3498DB' }}>
                <Instagram />
              </IconButton>
              <IconButton sx={{ color: '#3498DB' }}>
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={2}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ 
                textAlign: isArabic ? 'right' : 'left',
                direction: isArabic ? 'rtl' : 'ltr'
              }}
            >
              {isArabic ? 'روابط سريعة' : 'Quick Links'}
            </Typography>
            <Box
              sx={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                textAlign: isArabic ? 'right' : 'left',
                direction: isArabic ? 'rtl' : 'ltr'
              }}
            >
              <Link component={RouterLink} to="/" color="inherit" underline="hover">
                {isArabic ? 'الرئيسية' : 'Home'}
              </Link>
              <Link component={RouterLink} to="/features" color="inherit" underline="hover">
                {isArabic ? 'المميزات' : 'Features'}
              </Link>
              <Link component={RouterLink} to="/how-it-works" color="inherit" underline="hover">
                {isArabic ? 'كيف يعمل' : 'How It Works'}
              </Link>
              <Link component={RouterLink} to="/about" color="inherit" underline="hover">
                {isArabic ? 'من نحن' : 'About'}
              </Link>
              <Link component={RouterLink} to="/contact" color="inherit" underline="hover">
                {isArabic ? 'اتصل بنا' : 'Contact'}
              </Link>
            </Box>
          </Grid>

          {/* Legal */}
          <Grid item xs={12} md={2}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ 
                textAlign: isArabic ? 'right' : 'left',
                direction: isArabic ? 'rtl' : 'ltr'
              }}
            >
              {isArabic ? 'قانوني' : 'Legal'}
            </Typography>
            <Box
              sx={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                textAlign: isArabic ? 'right' : 'left',
                direction: isArabic ? 'rtl' : 'ltr'
              }}
            >
              <Link component={RouterLink} to="/privacy" color="inherit" underline="hover">
                {isArabic ? 'سياسة الخصوصية' : 'Privacy Policy'}
              </Link>
              <Link component={RouterLink} to="/terms" color="inherit" underline="hover">
                {isArabic ? 'شروط الاستخدام' : 'Terms of Service'}
              </Link>
              <Link 
                component={RouterLink} 
                to="/admin/login" 
                color="inherit" 
                underline="hover"
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5,
                  color: '#3498DB'
                }}
              >
                <AdminPanelSettings fontSize="small" />
                {isArabic ? 'لوحة الإدارة' : 'Admin Panel'}
              </Link>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={4}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ 
                textAlign: isArabic ? 'right' : 'left',
                direction: isArabic ? 'rtl' : 'ltr'
              }}
            >
              {isArabic ? 'تواصل معنا' : 'Contact Us'}
            </Typography>
            <Box
              sx={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                textAlign: isArabic ? 'right' : 'left',
                direction: isArabic ? 'rtl' : 'ltr'
              }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Email sx={{ color: '#3498DB' }} />
                <Typography variant="body2">
                  support@navigi.com
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Phone sx={{ color: '#3498DB' }} />
                <Typography variant="body2">
                  +213 555 123 456
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <LocationOn sx={{ color: '#3498DB' }} />
                <Typography variant="body2">
                  {isArabic 
                    ? 'الجزائر، العاصمة'
                    : 'Algiers, Algeria'
                  }
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: '#34495E' }} />

        {/* Copyright */}
        <Box 
          textAlign="center"
          sx={{ 
            textAlign: isArabic ? 'right' : 'center',
            direction: isArabic ? 'rtl' : 'ltr'
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © 2024 NAVIGI. {isArabic ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {isArabic 
              ? 'تطبيق آمن وموثوق لكسب المال من الإعلانات'
              : 'Safe and trusted app for earning money from ads'
            }
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;