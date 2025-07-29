import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const ContactPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8, mt: 8 }}>
      <Box textAlign="center">
        <Typography variant="h3" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Contact form and information will be added here.
        </Typography>
      </Box>
    </Container>
  );
};

export default ContactPage;