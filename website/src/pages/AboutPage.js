import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const AboutPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8, mt: 8 }}>
      <Box textAlign="center">
        <Typography variant="h3" gutterBottom>
          About NAVIGI
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Company information will be added here.
        </Typography>
      </Box>
    </Container>
  );
};

export default AboutPage;