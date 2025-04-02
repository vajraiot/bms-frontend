import {IconButton , Typography,useTheme,Box } from '@mui/material'
import React, { useState} from "react";

import { tokens } from '../../theme';

import { useState,useContext } from 'react'
import CellVTGraph from '../CellVTGraph';
import CloseIcon from "@mui/icons-material/Close";
 import thermometer from '../../assets/images/thermometer.svg'
import {BatteryLowVoltage,Charging,Discharging,OpenBattery,AboutToDie,HighTemperature,HighVoltage,CommunicationFailed} from '../../enums/ThresholdValues';
import { Paper, Typography, Box,useTheme } from '@mui/material';
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import { AppContext } from '../../services/AppContext';
const statusConfig = {
  'UT to Die': { svg: AboutToDie, color: '#C62828' },
  'Open Battery': { svg: OpenBattery, color: '#FF6D00' },
  'High Voltage': { svg: HighVoltage, color: '#F57F17' },
  'High Temperature': { svg: HighTemperature, color: '#D84315' },
  'Communication Failed': { svg: CommunicationFailed, color: '#455A64' },
  'Charging': { svg: Charging, color: '#4CAF50' },
  'Discharging': { svg: Discharging, color: '#FF5252' },
  'Low Voltage': { svg: BatteryLowVoltage, color: '#FF0000' },
};

const CellLayout = ({ cellData, thresholds, chargingStatus, siteId, serialNumber }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data} = useContext(AppContext);
  const device = data[0];
  const { bmsAlarmsDTO} = device;
  const handleClickOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  // Determine the status based on cell data and thresholds
  const determineStatus = () => {
    const { cellVoltage, cellTemperature} = cellData;
    const {
      LowVoltage,
      BatteryAboutToDie,
      OpenBattery,
      HighVoltage,
      HighTemperature,
    } = thresholds;

  
      // 1. Check for Communication Failure
      if (cellVoltage === 65.535 || cellTemperature === 65535) {
        return "Communication Failed";
      }
    
      if (cellVoltage <= parseFloat(OpenBattery)) {
        return "Open Battery";
      }
      if (cellVoltage <= parseFloat(BatteryAboutToDie) && cellVoltage > parseFloat(OpenBattery)) {
        return "UT to Die";
      }
      if(bmsAlarmsDTO.cellVoltageLN){
      if (cellVoltage <= parseFloat(LowVoltage)) {
        return "Low Voltage";
      }}
      // 2. Voltage Conditions
      if(bmsAlarmsDTO.cellVoltageNH){
      if (cellVoltage >= parseFloat(HighVoltage)) {
        return "High Voltage";
      }}
      if(bmsAlarmsDTO.cellTemperatureHN){
        if (cellTemperature >= parseFloat(HighTemperature)) {
          return "High Temperature";
        }
      }
      // 4. Charging Status
      return chargingStatus ? "Discharging" : "Charging";
  };
  

  const status = determineStatus();
  const { svg: StatusSVG, color } = statusConfig[status] || { svg: () => null, color: '#ffffff' };

  return (
    <>
      {/* Battery Cell Layout */}
      <Paper
  elevation={0}
  sx={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '65px',
    height: '76px', 
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
    ':hover': {
      transform: 'scale(1.05)',
    },
  }}
  onClick={handleClickOpen}
>
  {/* Battery Terminal */}
  <Box
    sx={{
      display: 'flex',
      gap: '4px',
      marginBottom: '-4px', // Adjust this to remove the gap
    }}
  >
    <Box
      sx={{
        width: '12px',
        height: '10px',
        backgroundColor: "rgb(27, 94, 32)",
        borderRadius: '3px 3px 0 0',
      }}
    />
    <Typography variant="h8" sx={{ color: '#333' }}>
      C {cellData.cellNumber}
    </Typography>
    <Box
      sx={{
        width: '12px',
        height: '10px',
        backgroundColor: "rgb(183, 28, 28)",
        borderRadius: '3px 3px 0 0',
      }}
    />
  </Box>

  {/* Battery Body */}
  <Box
    sx={{
      height: "63px",
      width:"53px",
      lineHeight: '7px',
      borderTop: '0.5px solid #000',
      borderLeft: '1px solid #000',
      borderRight: '3px solid #000',
      borderBottom: '3px solid #000',
      borderRadius: '5px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      overflow: 'hidden',
      backgroundColor: '#f5f5f5',
      boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.3)',
      padding: '0px 1px 1px 1px',
      boxSizing: 'border-box',
      transition: 'box-shadow 0.2s ease',
      ':hover': {
        boxShadow: 6,
      },
    }}
  >
    {/* Status Animation */}
    <Box>
      <StatusSVG />
    </Box>

    {/* Content */}
    <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
      {cellData.cellVoltage === 65.535 || cellData.cellTemperature === 65535 ? (
        <Box >
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h8" sx={{fontSize: "8px"}}>⚡</Typography>
            <Typography variant="h8" sx={{  fontWeight: 'bold', color: '#333',fontSize: "9px" }}>
              N/A
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
          <img src={thermometer} height={12} width={20} style={{ marginLeft: "-4px" }} />
          <Typography variant="h8" sx={{ fontWeight: 'bold', color: '#333', fontSize: "9px" }}>
            N/A
          </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h8"  sx={{ fontWeight: 'bold', color: '#333',fontSize: "9px" }}>sg :</Typography>
            <Typography variant="h8" sx={{ fontWeight: 'bold', color: '#333',fontSize: "9px" }}>
            N/A
          </Typography>
          </Box>
        </Box>
      ) : (
        <>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h8" sx={{fontSize: "8px"}}>⚡</Typography>
            <Typography variant="h8" sx={{  fontWeight: 'bold', color: '#333',fontSize: "9px" }}>
              {cellData?.cellVoltage} V
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
          <img src={thermometer} height={12} width={20} style={{ marginLeft: "-4px" }} />
          <Typography variant="h8" sx={{ fontWeight: 'bold', color: '#333', fontSize: "9px" }}>
            {cellData?.cellTemperature} °C
          </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h8"  sx={{ fontWeight: 'bold', color: '#333',fontSize: "9px" }}>sg :</Typography>
            <Typography variant="h8" sx={{ fontWeight: 'bold', color: '#333',fontSize: "9px" }}>
            {cellData?.cellSpecificgravity !== undefined && cellData?.cellSpecificgravity !== null
            ? Number(cellData.cellSpecificgravity).toFixed(5)
            : "N/A"}
          </Typography>
          </Box>
        </>

      )}
    </Box>
  </Box>
</Paper>

      {/* Full-Screen Overlay */}
      <CellVTGraph
      open={isOpen}
      onClose={handleClose}
      serial={serialNumber}
      site={siteId}
      cellNumber={cellData.cellNumber}
    />
    </>
  );
};

export default CellLayout;




const FullScreenOverlay = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        // backgroundColor: 'white',
        zIndex: 1300,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          width: '90%',
          height: '90%',
          // backgroundColor: 'white',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {children}
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 50,
            right: 270,
            color: 'red',
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
    </Box>
  );
};
