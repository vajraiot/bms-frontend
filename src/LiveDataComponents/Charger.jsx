import React from 'react'
import { Box, Typography,useTheme,useMediaQuery } from "@mui/material";
import { tokens } from "../theme.js"
import Acvoltage from "../assets/images/png/battery.png"
import Accurrent from "../assets/images/png/Ah capacity.png"
import frequenc from "../assets/images/png/frequency.png"

export const Charger = ({charger}) => {
    
    const theme =useTheme();
    const colors=tokens(theme.palette.mode);
    const{deviceId,acVoltage,acCurrent ,frequency ,energy}=charger[0];
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
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="flex-start"
          mt="10px"
          ml="8px"
        >
          <Typography variant={getVariant()} sx={{ alignSelf: "center", mb: { xs: '5px', sm: '10px' }}}>
            <strong>Charger Info</strong>
          </Typography>

          <Box
            display="flex"
            flexDirection="column"
          >
            {[
        
              { label: "AC Voltage", value: acVoltage, unit: "V" ,icon:Acvoltage},
              { label: "AC Current", value: acCurrent, unit: "A",icon:Accurrent },
              {label:"AC Energy", value:energy,unit:"kwh"},
              { label: "Frequency", value: frequency, unit: "Hz",icon:frequenc },
      
              
            ].map(({ label, value,unit,icon }, index) => (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                justifyContent="flex-start"
                gap="8px" // Adjust space between elements
              >
                🔹
                <Typography
                   variant={getVariant()}
                   sx={{
                    fontWeight: 'bold',
                    minWidth: { xs: '100px', sm: '150px', md: '200px', lg: '70px' },
                  }}
                >
                  {label}
                </Typography>
                <Typography
                   variant={getVariant()}
                  fontWeight="bold"
                  style={{ color: "inherit" }} // Ensures colon inherits label's color
                >
                  :
                </Typography>
                <Typography
                   variant={getVariant()}
                  fontWeight="bold"
                  style={{ color: "#000f89" }}
                >
                  {value}{" "}{unit}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
        </Box>
      );
}

export default Charger;