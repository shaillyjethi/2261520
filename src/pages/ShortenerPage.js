// ShortenerPage.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import ShortenerForm from '../components/ShortenerForm';
import StatisticsTable from '../components/StatisticsTable';
import { logger } from '../utils/logger';

export default function ShortenerPage() {
  const [shortenedUrls, setShortenedUrls] = useState([]);

  useEffect(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem('shortenedUrls');
    if (saved) {
      const parsed = JSON.parse(saved).map(item => ({
        ...item,
        createdAt: new Date(item.createdAt),
        expiresAt: new Date(item.expiresAt)
      }));
      setShortenedUrls(parsed);
      logger.info("api", "Loaded URLs from storage", { count: parsed.length });
    }
  }, []);

  const handleShorten = (newUrls) => {
    const updatedUrls = [...shortenedUrls, ...newUrls];
    setShortenedUrls(updatedUrls);
    localStorage.setItem('shortenedUrls', JSON.stringify(updatedUrls));
    logger.info("api", "URLs shortened", { count: newUrls.length });
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          URL Shortener
        </Typography>
        <ShortenerForm onShorten={handleShorten} existingShortCodes={shortenedUrls.map(u => u.shortCode)} />
      </Paper>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Recently Shortened URLs
        </Typography>
        <StatisticsTable data={shortenedUrls.slice(-5).reverse()} />
      </Box>
    </Container>
  );
}