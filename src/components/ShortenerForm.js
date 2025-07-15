import React, { useState } from 'react';
import { TextField, Button, Grid, Box, Typography } from '@mui/material';
import { logger } from '../utils/logger';

export default function ShortenerForm({ onShorten, existingShortCodes = [] }) {
  const [urls, setUrls] = useState([
    { longUrl: '', validity: '', shortCode: '' }
  ]);
  const [errors, setErrors] = useState([]);

  const handleChange = (index, field, value) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    setUrls(newUrls);
  };

  const addUrlField = () => {
    if (urls.length < 5) {
      setUrls([...urls, { longUrl: '', validity: '', shortCode: '' }]);
      logger.info('api', 'Added URL field');
    } else {
      logger.warn('api', 'Max URL fields reached');
    }
  };

  const validateInputs = () => {
    const errs = [];
    const validUrls = [];
    const usedShortCodes = new Set(existingShortCodes);
    urls.forEach((url, idx) => {
      if (!url.longUrl) {
        errs[idx] = 'Long URL is required';
        return;
      }
      let validity = parseInt(url.validity, 10);
      if (isNaN(validity) || validity <= 0) validity = 30;
      let shortCode = url.shortCode.trim();
      if (!shortCode) {
        // Generate a random 6-char code
        shortCode = Math.random().toString(36).substring(2, 8);
      }
      if (usedShortCodes.has(shortCode)) {
        errs[idx] = 'Short code must be unique';
        return;
      }
      usedShortCodes.add(shortCode);
      validUrls.push({
        longUrl: url.longUrl,
        validity,
        shortCode,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + validity * 60000),
        clicks: []
      });
    });
    setErrors(errs);
    return validUrls;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validUrls = validateInputs();
    if (validUrls.length > 0) {
      logger.info('api', 'URLs shortened', { count: validUrls.length });
      onShorten(validUrls);
      setUrls([{ longUrl: '', validity: '', shortCode: '' }]);
      setErrors([]);
    } else {
      logger.warn('api', 'URL validation failed', { errors });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Shorten URLs (Max 5)
      </Typography>
      {urls.map((url, index) => (
        <Grid container spacing={2} key={index} alignItems="center" sx={{ mb: 1 }}>
          <Grid item xs={5}>
            <TextField
              label="Long URL"
              value={url.longUrl}
              onChange={e => handleChange(index, 'longUrl', e.target.value)}
              fullWidth
              required
              error={!!errors[index] && errors[index].includes('Long URL')}
              helperText={errors[index] && errors[index].includes('Long URL') ? errors[index] : ''}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Validity (minutes)"
              value={url.validity}
              onChange={e => handleChange(index, 'validity', e.target.value)}
              fullWidth
              type="number"
              placeholder="30"
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Custom Short Code (optional)"
              value={url.shortCode}
              onChange={e => handleChange(index, 'shortCode', e.target.value)}
              fullWidth
              placeholder="Leave blank to auto-generate"
              error={!!errors[index] && errors[index].includes('Short code')}
              helperText={errors[index] && errors[index].includes('Short code') ? errors[index] : ''}
            />
          </Grid>
        </Grid>
      ))}
      <Button
        variant="outlined"
        onClick={addUrlField}
        sx={{ mr: 2 }}
        disabled={urls.length >= 5}
      >
        Add Another URL
      </Button>
      <Button
        type="submit"
        variant="contained"
        color="primary"
      >
        Shorten URLs
      </Button>
    </Box>
  );
}