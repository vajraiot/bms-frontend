import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import Pictorial from './Pictorial'; // Adjust the path as per your file structure
import Legends from '../Legends'; // Import Legends component

const FullCellLayout = ({ cellDataList, serialNumber, siteId, chargingStatus }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        p: 2,
        // backgroundColor: 'black', // Background of the entire page
        color: 'white', // Text color
      }}
    >
      {/* Heading */}
      <Box
        sx={{
          mb: 3,
          textAlign: 'center',
          fontSize: { xs: '1.5rem', sm: '2rem' }, // Responsive font size
          fontWeight: 'bold',
          color: 'white',
        }}
      >
        <Typography variant="h3" fontWeight="bold">CELL DATA</Typography>
      </Box>

      {/* Legends Section */}
      <Box
        sx={{
          backgroundColor: 'white',
          p: 2,
          borderRadius: '8px',
          mb: 3,
          boxShadow: 3, // Adding subtle shadow for better visual separation
        }}
      >
        <Legends cellVoltageTemperatureData={cellDataList} />
      </Box>

      {/* Pictorial Layout */}
      <Box
        sx={{
          flexGrow: 1,
          backgroundColor: 'white', // Black background for pictorial layout
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: 3, // Adding shadow for separation
        }}
      >
        <Pictorial
          cellDataList={cellDataList}
          serialNumber={serialNumber}
          siteId={siteId}
          chargingStatus={chargingStatus}
        />
      </Box>
    </Box>
  );
};

export default FullCellLayout;
