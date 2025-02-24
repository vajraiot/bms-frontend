import { Box} from '@mui/material'
import React from 'react'
import Grid from '@mui/material/Grid2';
import CellLayout from './CellLayout';
import {CellThresholdValues} from '../../enums/ThresholdValues'
const Pictorial = ({ cellDataList, serialNumber, siteId ,chargingStatus }) => {
  return (
    <Box
      sx={{
        height: "100%", // Take full height of the parent
        overflowY: "auto", // Scroll within the allocated height
        flexGrow: 1,
        // pl: 1,
        pb: 1
      }}
    >
      <Grid container spacing={1} justifyContent="center">
        {cellDataList.map((cell) => (
          <Grid item key={cell.id}>
            <CellLayout
              cellData={cell}
              thresholds={CellThresholdValues()}
              chargingStatus={chargingStatus}
              serialNumber={serialNumber}
              siteId={siteId}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Pictorial