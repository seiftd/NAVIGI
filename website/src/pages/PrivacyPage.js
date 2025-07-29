import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const PrivacyPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8, mt: 8 }}>
      <Box textAlign="center">
        <Typography variant="h3" gutterBottom>
          Privacy Policy
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Privacy policy details will be added here.
        </Typography>
      </Box>
    </Container>
  );
};

export default PrivacyPage;