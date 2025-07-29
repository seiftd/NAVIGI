import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const HowItWorksPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8, mt: 8 }}>
      <Box textAlign="center">
        <Typography variant="h3" gutterBottom>
          How It Works
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Step-by-step guide will be added here.
        </Typography>
      </Box>
    </Container>
  );
};

export default HowItWorksPage;