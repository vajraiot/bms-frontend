import React from 'react';
import { Box, Typography } from '@mui/material';
import BMS from "../../assets/images/jpeg/BMS.jpeg"; // Importing the image

const Header = () => {
  return (
    <Box
      sx={{
        textAlign: 'center',
       // Fallback background color
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${BMS})`, // Adding the gradient overlay
        backgroundSize: 'cover', // Ensure the image covers the entire header
        backgroundPosition: 'center', // Center the image
        padding: '20px 0',
      
      }}
    >
      <Typography
        component="h1"
        className="header-title"
        sx={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#fff', // Text color set to white
          textTransform: 'uppercase',
          letterSpacing: '1px',
          textShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)', // Shadow added to text
        }}
      >
        Remote Battery Management & Battery Charger Monitoring System
      </Typography>
    </Box>
  );
};

export default Header;
