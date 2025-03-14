import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme,Box } from '@mui/material';
import { tokens } from '../../theme';

const VoltageG = ({ data }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Filter out invalid voltage values (65.535)
  const filteredData = data.map(cell => ({
    ...cell,
    cellVoltage: cell.cellVoltage === 65.535 ? 0 : cell.cellVoltage
  }));

  return (
    <Box sx={{ height: '200px', width: '100%', marginBottom: '50px'}}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={filteredData}>
          <XAxis 
            dataKey="cellNumber" 
            tick={{ fill: 'black' }} 
            label={{ value: '', position: 'insideBottom', offset: -10, fill: "black" }}
          />
          <YAxis 
            tick={{ fill: 'black' }} 
            label={{ value: 'Voltage (V)', angle: -90, position: 'insideLeft', fill: 'black' }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: colors.primary[400], border: 'none' }}
            formatter={(value) => [`${value} V`, 'Voltage']}
          />
          {/* <Legend /> */}
          <Bar 
            dataKey="cellVoltage" 
            fill={colors.greenAccent[500]} 
            name="Voltage (V)"
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default VoltageG;