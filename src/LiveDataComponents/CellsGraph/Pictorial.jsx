import { Box} from '@mui/material'
import React from 'react'
import Grid from '@mui/material/Grid2';
import CellLayout from './CellLayout';
import {CellThresholdValues} from '../../enums/ThresholdValues'
const Pictorial = ({ cellDataList, serialNumber, siteId, chargingStatus }) => {
  const itemHeight = 76; // Fixed height for each CellLayout container
  const itemWidth = 65; // Fixed width for each CellLayout container
  const gap = 0; // Gap between items

  return (
    <Box
      sx={{
        height: "100%", // Take full height of the parent
        overflowY: "auto", // Enable scrolling if content exceeds height
      }}
    >
      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="center"
        alignItems="flex-start" // Align items at the top
        alignContent="flex-start" // Align rows at the top
        gap={`${gap}px`}
      >
        {cellDataList.map((cell) => (
          <Box
            key={cell.id}
            sx={{
              height: `${itemHeight}px`, // Fixed height for each CellLayout container
              width: `${itemWidth}px`, // Fixed width for each CellLayout container
            }}
          >
            <CellLayout
              cellData={cell}
              thresholds={CellThresholdValues()}
              chargingStatus={chargingStatus}
              serialNumber={serialNumber}
              siteId={siteId}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};
export default Pictorial