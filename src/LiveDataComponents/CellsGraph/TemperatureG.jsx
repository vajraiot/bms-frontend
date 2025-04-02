import React from 'react';

import { BarChart, Bar, XAxis, YAxis, LabelList, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme,Box,Typography } from '@mui/material';
import { tokens } from '../../theme';

const TemperatureG = ({ data }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Filter out invalid temperature values (65535)
  const filteredData = data.filter(cell=> cell.cellTemperature !== 65535)
  

  return (
    <Box sx={{ height: '150px', width: '100%', marginBottom: '30px' }}>
         <Typography 
        variant="h6" 
        sx={{ 
          textAlign: 'center', 
          marginBottom: '10px', 
          color: "black", // Adjust color to match your theme
          fontWeight: 'bold'
        }}
      >
        Cell Temperature
      </Typography>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={filteredData}
          margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
        >
          <XAxis 
            dataKey="cellNumber" 
            tick={{ fill: 'black', fontSize: 12 }}
            interval={0}
          />
          <YAxis
            hide={true} // Hides Y-axis values
          />
          <Tooltip
            contentStyle={{ 
              backgroundColor: colors.primary[400], 
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px'
            }}
            formatter={(value) => [`${value.toFixed(1)} °C`, 'Temperature']}
          />
          <Bar
            dataKey="cellTemperature"
            fill={colors.blueAccent[500]}
            maxBarSize={40} // Limits maximum bar width
            minPointSize={2} // Ensures bars are visible even with many cells
          >
            {/* Add labels on top of bars */}
            {/* {filteredData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors.blueAccent[500]} />
            ))} */}
            <LabelList 
              dataKey="cellTemperature" 
              position="top" 
              formatter={(value) => value.toFixed(1)}
              style={{ 
                fill: 'black', 
                fontSize: '12px',
                fontWeight: '500'
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};
export default TemperatureG;