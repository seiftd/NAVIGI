import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const FeaturesPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8, mt: 8 }}>
      <Box textAlign="center">
        <Typography variant="h3" gutterBottom>
          Features Page
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Detailed features will be added here.
        </Typography>
      </Box>
    </Container>
  );
};

export default FeaturesPage;