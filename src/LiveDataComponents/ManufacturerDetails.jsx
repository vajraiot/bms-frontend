import React from "react";
import { Box, Typography, useTheme ,useMediaQuery} from "@mui/material";
import { tokens } from "../theme.js";
import Calendar from "../assets/images/png/calendar.png";
import BatterySerialNumber from "../assets/images/png/battery.png";
import typeOfBatteryBank from "../assets/images/png/type of BB.png";
import ah from "../assets/images/png/Ah capacity.png";
import mfname from "../assets/images/png/mfname.png";



function ManufacturerDetails({
  firstUsedDate,
  batterySerialNumber,
  batteryBankType,
  ahCapacity,
  manifactureName,
  individualCellVoltage,
  designVoltage,
}) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Media queries for breakpoints
  const isXs = useMediaQuery(theme.breakpoints.down('sm')); // < 600px
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md')); // 600px–899px
  const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg')); // 900px–1199px
  const isLg = useMediaQuery(theme.breakpoints.up('lg')); // 1200px+

  // Dynamic variant based on screen size
  const getVariant = () => {
    if (isXs) return 'h8'; // 10px
    if (isSm) return 'h7'; // 12px
    if (isMd) return 'h6'; // 14px
    if (isLg) return 'h6'; // 16px
    return 'h6'; // Default fallback
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          ml: { xs: '4px', sm: '8px', md: '12px' },
        }}
      >
        <Typography
          sx={{ alignSelf: 'center', mb: { xs: '5px', sm: '10px' } }}
          variant={getVariant()}
        >
          <strong>Manufacturer Info</strong>
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {[
           {
              label: 'First Used Date',
              value: new Date(firstUsedDate).toLocaleString('en-GB', {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric',
                hour12: false,
              }),
            },
            { label: 'Battery Serial Number', value: batterySerialNumber },
            { label: 'Type of Battery Bank', value: batteryBankType },
            { label: 'Ah Capacity', value: ahCapacity, unit: 'Ah' },
            { label: 'Manufacturer Name', value: manifactureName },
            { label: 'Design Voltage', value: designVoltage, unit: 'V' },
            { label: 'Individual Cell Voltage', value: individualCellVoltage, unit: 'V' },
          ].map(({ label, value, unit }, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: { xs: '4px', sm: '8px' },
              }}
            >
              🔹
              <Typography
                variant={getVariant()}
                sx={{
                  fontWeight: 'bold',
                  minWidth: { xs: '100px', sm: '150px', md: '200px', lg: '150px' },
                }}
              >
                {label}
              </Typography>
              <Typography variant={getVariant()} sx={{ fontWeight: 'bold', color: 'inherit' }}>
                :
              </Typography>
              <Typography
                variant={getVariant()}
                sx={{ fontWeight: 'bold', color: '#000f89' }}
              >
                {value} {unit}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
export default ManufacturerDetails;
