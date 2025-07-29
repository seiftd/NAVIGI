import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Container
} from '@mui/material';
import { Language, Menu as MenuIcon } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const [langAnchor, setLangAnchor] = useState(null);

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    setLangAnchor(null);
  };

  const navItems = [
    { label: i18n.language === 'ar' ? 'الرئيسية' : 'Home', path: '/' },
    { label: i18n.language === 'ar' ? 'المميزات' : 'Features', path: '/features' },
    { label: i18n.language === 'ar' ? 'كيف يعمل' : 'How It Works', path: '/how-it-works' },
    { label: i18n.language === 'ar' ? 'من نحن' : 'About', path: '/about' },
    { label: i18n.language === 'ar' ? 'اتصل بنا' : 'Contact', path: '/contact' }
  ];

  return (
    <AppBar position="fixed" sx={{ bgcolor: 'white', color: '#2C3E50' }}>
      <Container maxWidth="lg">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#3498DB', fontWeight: 'bold' }}>
            NAVIGI
          </Typography>
          
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                sx={{
                  color: location.pathname === item.path ? '#3498DB' : '#2C3E50',
                  fontWeight: location.pathname === item.path ? 'bold' : 'normal'
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          <IconButton
            onClick={(e) => setLangAnchor(e.currentTarget)}
            sx={{ ml: 2 }}
          >
            <Language />
          </IconButton>

          <Menu
            anchorEl={langAnchor}
            open={Boolean(langAnchor)}
            onClose={() => setLangAnchor(null)}
          >
            <MenuItem onClick={() => handleLanguageChange('en')}>
              English
            </MenuItem>
            <MenuItem onClick={() => handleLanguageChange('ar')}>
              العربية
            </MenuItem>
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;