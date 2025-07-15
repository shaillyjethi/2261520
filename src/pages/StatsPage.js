// StatsPage.js
import React from 'react';
import { Container, Typography } from '@mui/material';
import StatisticsTable from '../components/StatisticsTable';
import { logger } from '../utils/logger';

export default function StatsPage() {
  const shortenedUrls = JSON.parse(localStorage.getItem('shortenedUrls') || '[]')
    .map(item => ({
      ...item,
      createdAt: new Date(item.createdAt),
      expiresAt: new Date(item.expiresAt)
    }));

  logger.info("api", "Accessed statistics page", { urlCount: shortenedUrls.length });

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
        URL Statistics
      </Typography>
      <StatisticsTable data={shortenedUrls} />
    </Container>
  );
}