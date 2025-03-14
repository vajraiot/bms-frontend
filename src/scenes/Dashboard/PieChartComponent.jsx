import React from 'react';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';
import { Box, Typography } from '@mui/material';

const PieChartComponent = ({ data2 = [], handlePieClick }) => {
  const outerRadius = 80;
  const innerRadius = 25;
  const chartSize = 230;

  const isDataValid = Array.isArray(data2) && data2.length > 0 && !data2.every((entry) => entry.value === 0);

  return (
    <Box
      border={1}
      borderColor="grey.300"
      borderRadius={2}
      padding="15px 20px 15px 23px"
      boxShadow={3}
      display="flex"
      flexDirection="column"
      alignItems="center"
      height="230px"
      width="fit-content"
    >
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        BMS Alarms Overview
      </Typography>
      <Box display="flex" justifyContent="center" alignItems="center" mt={-4}> {/* Adjusted margin-top to move content up */}
        {isDataValid ? (
          <PieChart width={chartSize} height={chartSize}>
            <defs>
              <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="rgba(0, 0, 0, 0.7)" />
              </filter>
              <linearGradient id="criticalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#DB3445" />
                <stop offset="100%" stopColor="#F71735" />
              </linearGradient>
              <linearGradient id="nonCriticalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d82b27" />
                <stop offset="100%" stopColor="#f09819" />
              </linearGradient>
              <linearGradient id="aboutToDieGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9d50bb" />
                <stop offset="100%" stopColor="#6e48aa" />
              </linearGradient>
              <linearGradient id="alarmsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e8b409" />
                <stop offset="100%" stopColor="#f4ee2e" />
              </linearGradient>
              <linearGradient id="defaultGreenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4CAF50" />
                <stop offset="100%" stopColor="#81C784" />
              </linearGradient>
            </defs>
            <Pie
              data={data2}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              paddingAngle="5"
              cornerRadius="5"
              outerRadius={outerRadius}
              innerRadius={innerRadius}
              label
              onClick={(e) => handlePieClick(e)}
              style={{ filter: 'url(#shadow)' }}
            >
              {data2.map((entry, index) => {
                const gradientIds = [
                  "url(#criticalGradient)",
                  "url(#nonCriticalGradient)",
                  "url(#aboutToDieGradient)",
                  "url(#alarmsGradient)",
                ];
                return <Cell key={`cell-${index}`} fill={gradientIds[index % gradientIds.length]} />;
              })}
            </Pie>
            <Tooltip />
          </PieChart>
        ) : data2.length === 0 || data2.every((entry) => entry.value === 0) ? (
          <PieChart width={chartSize} height={chartSize}>
            <defs>
              <linearGradient id="defaultGreenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4CAF50" />
                <stop offset="100%" stopColor="#81C784" />
              </linearGradient>
            </defs>
            <Pie data={[{ name: "Default", value: 1 }]} cx="50%" cy="50%" outerRadius={outerRadius - 10}>
              <Cell fill="url(#defaultGreenGradient)" />
            </Pie>
          </PieChart>
        ) : (
          <Typography variant="body1">No data available for BMS alarms.</Typography>
        )}
        <Box ml={1}>
          {Array.isArray(data2) && data2.map((entry, index) => (
            <Box key={index} display="flex" alignItems="center" mb={1}>
              <Box
                width={10}
                height={10}
                borderRadius="50%"
                mr={1}
                style={{
                  background: `linear-gradient(to right, ${
                    [
                      "#DB3445, #F71735", // Critical
                      "#ff6a6a, #ff3d3d", // Non-Critical
                      "#9d50bb, #6e48aa", // About to Die
                      "#FFD54F, #FFEB3B", // Alarms
                    ][index % 4]
                  })`,
                }}
              />
              <Typography variant="body2" style={{ fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' }}>{entry.name}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default PieChartComponent;