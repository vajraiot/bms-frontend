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

    const highTempThreshold = parseFloat(HighTemperature) ;
    const highVoltThreshold = parseFloat(HighVoltage) ;
    const lowVoltThreshold = parseFloat(LowVoltage) ;

    const highTemperatureCount = cellVoltageTemperatureData.filter(
        ({ cellTemperature }) => cellTemperature > highTempThreshold
    ).length;

    const communicatingCount = cellVoltageTemperatureData.filter(
        ({ cellVoltage, cellTemperature }) => 
            cellVoltage !== 65.535 && cellTemperature !== 65535
    ).length;

    const nonCommunicatingCount = cellVoltageTemperatureData.length - communicatingCount;

    const highVoltageCount = cellVoltageTemperatureData.filter(
        ({ cellVoltage }) => cellVoltage > highVoltThreshold
    ).length;

    const lowVoltageCount = cellVoltageTemperatureData.filter(
        ({ cellVoltage }) => cellVoltage < lowVoltThreshold
    ).length;
    return (
        <Box display="flex" flexDirection="column" gap="0px">
            <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" ,textAlign:"center"}} >
                Cell Info
            </Typography>
            <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                padding="0px 5px 0px 5px"
                border="0px solid #ccc"
                borderRadius="8px"
                //backgroundColor={colors.primary[400]}
                sx={{  overflowX: 'auto' }} // Allow horizontal scrolling if needed
            >
                {[
                    { label: 'High Temp', value: highTemperatureCount, color: "#db4f4a" },
                    { label: 'Commun', value: communicatingCount, color: "#4cceac" },
                    { label: 'Not Commun', value: nonCommunicatingCount, color: "#666666"},
                    { label: 'High Voltage', value: highVoltageCount, color: "#db4f4a" },
                    { label: 'Low Voltage', value: lowVoltageCount, color: "#6870fa" },
                    { label: 'Charging', icon: CellLegends.LegendCharging, color: 'green' },
                    { label: 'DisCharging', icon: CellLegends.LegendDisCharging, color: 'olive' },
                    { label: 'Low Volt', icon: CellLegends.BatteryLowVoltage, color: '#1e88e5' },
                    { label: 'About to Die', icon: CellLegends.BatteryAboutToDie, color: 'red' },
                    { label: 'Open Battery', icon: CellLegends.OpenBattery, color: 'red' },
                    { label: 'High Voltage', icon: CellLegends.BatteryHighVoltage, color: 'brown' },
                    { label: 'High Temp', icon: CellLegends.BatteryHighTemperature, color: 'purple' },
                    { label: 'CommnFail', icon: CellLegends.CommnFail, color: 'black' },
                ].map((item, index) => (
                    <Box
                        key={index}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        borderRadius="8px"
                        //backgroundColor={colors.primary[300]}
                        sx={{ flexShrink: 0 }} // Fixed width and prevent shrinking
                    >
                        {item.icon ? (
                            <>
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    marginBottom="2px"
                                >
                                    {item.icon}
                                </Box>
                                <Typography variant="body2" align="center" sx={{ color: item.color, fontWeight: 'bold' }}>
                                    {item.label}
                                </Typography>
                            </>
                        ) : (
                            <>
                                <Typography variant="body2" align="center" sx={{ color: item.color, fontWeight: 'bold' }}>
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