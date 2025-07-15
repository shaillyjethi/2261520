import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton, Collapse, Box } from '@mui/material';
import { logger } from '../utils/logger';

function Row({ row }) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton size="small" onClick={() => {
            setOpen(!open);
            logger.info("api", "Toggled click details", { shortCode: row.shortCode });
          }}>
            {open ? '▼' : '►'}
          </IconButton>
        </TableCell>
        <TableCell>
          <a href={row.shortUrl} target="_blank" rel="noopener noreferrer">
            {row.shortUrl}
          </a>
        </TableCell>
        <TableCell>{row.createdAt.toLocaleString()}</TableCell>
        <TableCell>{row.expiresAt.toLocaleString()}</TableCell>
        <TableCell>{row.clicks?.length || 0}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom>
                Click Details
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Source</TableCell>
                    <TableCell>Location</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.clicks?.map((click, index) => (
                    <TableRow key={index}>
                      <TableCell>{click.timestamp}</TableCell>
                      <TableCell>{click.source}</TableCell>
                      <TableCell>{click.location || 'Unknown'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function StatisticsTable({ data }) {
  if (!data || data.length === 0) {
    return <Typography variant="body1">No URLs shortened yet</Typography>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Short URL</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Expires</TableCell>
            <TableCell>Clicks</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => (
            <Row key={item.shortCode} row={item} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}