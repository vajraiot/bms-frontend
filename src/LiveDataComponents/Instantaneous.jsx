import React from 'react'
import { Box, Typography,useTheme } from "@mui/material";
import { tokens } from "../theme.js"
import BarChart from '../charts/BarChart.js';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from "recharts";

export const Instantaneous = ({voltage,current,soc,dod,ambientTemperature}) => {
    const theme =useTheme();
    const colors=tokens(theme.palette.mode);
    
    
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
          <Typography variant="h6" mb="10px">
            <strong>Instantaneous Data</strong>
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
          >
            {[
              { label: "Voltage", value: voltage },
              { label: "Current", value: current },
              { label: "SOC", value: soc },
              { label: "DOD", value: dod },
              { label: "Ambient Temp", value: ambientTemperature },
              
            ].map(({ label, value }, index) => (
               <Box
                  key={index}
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-start"
                  gap="8px" // Adjust space between elements
                >
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    style={{ minWidth: "130px" }} // Fixed width for labels
                  >
                    {label}
                  </Typography>
                  <Typography
                    variant="h5"
                    style={{ color: "inherit" }} // Ensures colon inherits label's color
                  >
                    :
                  </Typography>
                  <Typography
                    variant="h5"
                    style={{ color: colors.greenAccent[500] }}
                  >
                    {value}
                  </Typography>
                </Box>
            ))}
          </Box>
        </Box>
        </Box>
      );
}
export default Instantaneous;