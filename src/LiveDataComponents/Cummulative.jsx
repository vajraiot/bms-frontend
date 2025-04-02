import React from "react";
import { Box, Typography, useTheme,useMediaQuery } from "@mui/material";
import { tokens } from "../theme.js"; 
import count from "../assets/images/png/cycle count.png";
import ah from "../assets/images/png/Ah capacity.png";
import chargeenergy from "../assets/images/png/charge energy.png";
import dischargeenergy from "../assets/images/png/dis charge.png";
import runhours from "../assets/images/png/run hours.png";



export default function Cummulative({
  chargeDischargeCycles,
  ampereHourIn,
  ampereHourOut,
  chargingEnergy,
  dischargingEnergy,
  time
}) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
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
  const batteryRunHours = (totalSeconds = 0) => {
    try {
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      const hr = hours < 10 ? "0" + hours : hours;
      const mn = minutes < 10 ? "0" + minutes : minutes;
      const sc = seconds < 10 ? "0" + seconds : seconds;

      return `${hr}:${mn}:${sc}`;
    } catch (error) {
      return "--";
    }
  };

  // Mapping labels to image paths
  const iconMap = {
     "Cycle count": count,
     "Ampere Hour In": ah,
     "Ampere Hour Out": ah,
     "Charging Energy": chargeenergy,
    "Discharging Energy":dischargeenergy,
    "Battery Run Hours": runhours,
  };

  return (
    <Box>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="flex-start"
      
        ml="8px"
        pb="23px"
        mr="10px"
      >
        <Typography variant={getVariant()} sx={{ alignSelf: "center", mb: { xs: '5px', sm: '10px' }}}>
          <strong>Cummulative Info</strong>
        </Typography>
        <Box display="flex" flexDirection="column">
          {[
            { label: "Cycle count", value: chargeDischargeCycles },
            { label: "Ampere Hour In", value: ampereHourIn, unit: "Ah" },
            { label: "Ampere Hour Out", value: ampereHourOut, unit: "Ah" },
            { label: "Charging Energy", value: chargingEnergy, unit: "Kwh" },
            { label: "Discharging Energy", value: dischargingEnergy, unit: "Kwh" },
            { label: "Battery Run Hours", value: batteryRunHours(time) }
          ].map(({ label, value, unit }, index) => (
            <Box
              key={index}
              display="flex"
              alignItems="center"
              justifyContent="flex-start"
              gap="8px"
            
            >
              {/* Render the corresponding image */}
              🔹

              <Typography variant={getVariant()} 
               sx={{
                fontWeight: 'bold',
                minWidth: { xs: '100px', sm: '150px', md: '200px', lg: '120px' },
              }}
              fontWeight="bold">
                {label}
              </Typography>
              <Typography variant={getVariant()}  fontWeight="bold" style={{ color: "inherit" }}>:</Typography>
              <Typography variant={getVariant()} fontWeight="bold" style={{ color: "#000f89" }}>
                {value}{" "}{unit}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
