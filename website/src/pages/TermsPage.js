import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const TermsPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8, mt: 8 }}>
      <Box textAlign="center">
        <Typography variant="h3" gutterBottom>
          Terms of Service
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Terms and conditions will be added here.
        </Typography>
      </Box>
    </Container>
  );
};

export default TermsPage;