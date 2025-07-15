import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { logger } from '../utils/logger';

export default function RedirectHandler({ urlData }) {
  const { shortCode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const recordClick = () => {
      const urlItemIndex = urlData.findIndex(item => item.shortCode === shortCode);
      if (urlItemIndex === -1) return;

      const newData = [...urlData];
      const urlItem = newData[urlItemIndex];
      
      // Record click details
      const clickData = {
        timestamp: new Date().toISOString(),
        source: document.referrer || 'Direct',
        location: 'Unknown' // Would use geolocation API in real implementation
      };
      
      if (!urlItem.clicks) {
        urlItem.clicks = [clickData];
      } else {
        urlItem.clicks.push(clickData);
      }
      
      // Update localStorage
      localStorage.setItem('shortenedUrls', JSON.stringify(newData));
      
      // Log the access
      logger.info("api", "URL accessed", {
        shortCode,
        url: urlItem.longUrl,
        referrer: document.referrer
      });
      
      // Redirect to original URL
      window.location.href = urlItem.longUrl;
    };

    const urlItem = urlData.find(item => item.shortCode === shortCode);
    
    if (!urlItem) {
      logger.error("api", "Redirect failed: URL not found", { shortCode });
      navigate('/');
      return;
    }

    if (new Date() > new Date(urlItem.expiresAt)) {
      logger.error("api", "Redirect failed: URL expired", { 
        shortCode,
        expiredAt: urlItem.expiresAt
      });
      navigate('/');
      return;
    }

    recordClick();
  }, [shortCode, urlData, navigate]);

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <p>Redirecting to the requested URL...</p>
    </div>
  );
}