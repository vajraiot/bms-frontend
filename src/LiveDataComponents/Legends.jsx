import React,{useContext} from 'react'
import {Box,  useTheme,Typography} from '@mui/material'
import { tokens } from '../theme';
import { CellLegends,CellThresholdValues,BatteryLowVoltage,Charging,Discharging} from '../enums/ThresholdValues';
import { AppContext } from '../services/AppContext';

const Legends = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const {
        data, 
      }=useContext(AppContext)
    
      const device = data[0];

const {
    LowVoltage,
    HighVoltage,
    HighTemperature,
  } = CellThresholdValues();
  const{cellVoltageTemperatureData}=device
  if(!LowVoltage && !HighVoltage && !HighTemperature && !device && !cellVoltageTemperatureData){
    return
  }

  const highTempThreshold = parseFloat(HighTemperature);
  const highVoltThreshold = parseFloat(HighVoltage);
  const lowVoltThreshold = parseFloat(LowVoltage);
  
  // Helper function to check if a cell is communicating
  const isCommunicating = (cell) => 
    cell.cellVoltage !== 65.535 && cell.cellTemperature !== 65535;
  
  // Count cells with high temperature
  const highTemperatureCount = cellVoltageTemperatureData.filter(
    (cell) => cell.cellTemperature !== 65535 && cell.cellTemperature > highTempThreshold
  ).length;
  
  // Count communicating cells
  const communicatingCount = cellVoltageTemperatureData.filter(isCommunicating).length;
  
  // Count non-communicating cells
  const nonCommunicatingCount = cellVoltageTemperatureData.length - communicatingCount;
  
  // Count cells with high voltage
  const highVoltageCount = cellVoltageTemperatureData.filter(
    (cell) => cell.cellVoltage !== 65.535 && cell.cellVoltage > highVoltThreshold
  ).length;
  
  // Count cells with low voltage
  const lowVoltageCount = cellVoltageTemperatureData.filter(
    (cell) => cell.cellVoltage < lowVoltThreshold
  ).length;
    return (
      <Box display="flex" flexDirection="column" gap="0px">
        {/* Header Section */}
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between" // Distribute space between the two titles
          width="100%"
          padding="0px 0px"
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              flex: 1, 
              pr:"120px"// Equal width for both titles
            }}
          >
            Cell Info
          </Typography>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              flex: 1, // Equal width for both titles
            }}
          >
          
          </Typography>
        </Box>

        {/* Content Section */}
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          padding="0px 5px 0px 5px"
          border="0px solid #ccc"
          borderRadius="8px"
          sx={{ overflowX: "auto" }} // Allow horizontal scrolling if needed
        >
          {[
            { label: "High Temp", value: highTemperatureCount, color: "#db4f4a" },
            { label: "Commun", value: communicatingCount, color: "#4cceac" },
            { label: "Not Commun", value: nonCommunicatingCount, color: "#666666" },
            { label: "High Voltage", value: highVoltageCount, color: "#db4f4a" },
            { label: "Low Voltage", value: lowVoltageCount, color: "#6870fa" },
            { label: "Charging", icon: CellLegends.LegendCharging, color: "green" },
            { label: "DisCharging", icon: CellLegends.LegendDisCharging, color: "olive" },
            { label: "Low Volt", icon: CellLegends.BatteryLowVoltage, color: "#1e88e5" },
            { label: "About to Die", icon: CellLegends.BatteryAboutToDie, color: "red" },
            { label: "Open Battery", icon: CellLegends.OpenBattery, color: "red" },
            { label: "High Voltage", icon: CellLegends.BatteryHighVoltage, color: "brown" },
            { label: "High Temp", icon: CellLegends.BatteryHighTemperature, color: "purple" },
            { label: "CommnFail", icon: CellLegends.CommnFail, color: "black" },
          ].map((item, index) => (
            <Box
              key={index}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              borderRadius="8px"
              sx={{ flexShrink: 0, minWidth: "80px" }} // Fixed min-width to prevent squashing
            >
              {item.icon ? (
                <>
                  <Box display="flex" alignItems="center" justifyContent="center" marginBottom="2px">
                    {item.icon}
                  </Box>
                  <Typography
                    variant="body2"
                    align="center"
                    sx={{ color: item.color, fontWeight: "bold" }}
                  >
                    {item.label}
                  </Typography>
                </>
              ) : (
                <>
                  <Typography
                    variant="body2"
                    align="center"
                    sx={{ color: item.color, fontWeight: "bold" }}
                  >
                    {item.label}
                  </Typography>
                  <Typography variant="body1" align="center" sx={{ color: item.color }}>
                    {item.value}
                  </Typography>
                </>
              )}
            </Box>
          ))}
        </Box>
      </Box>
    );
};

export default Legends;