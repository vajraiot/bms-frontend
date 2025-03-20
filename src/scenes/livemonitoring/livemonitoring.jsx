import { Grid,Box, Paper, Typography, Button, Modal,useTheme, Container} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { tokens } from "../../theme";
import ManufacturerDetails from "../../LiveDataComponents/ManufacturerDetails";
import DischargeCycleWise from "../../LiveDataComponents/DischargeCycleWise";
import Cummulative from "../../LiveDataComponents/Cummulative";
import ChargeCycleWise from "../../LiveDataComponents/ChargeCycleWise";
import MapWithMarker from "../../LiveDataComponents/MapWithMarker";
import Topbar from "../global/Topbar";
import { AppContext } from "../../services/AppContext";
import CellsData from "../../LiveDataComponents/CellsData";
import Alerts from "../../LiveDataComponents/Alerts";
import Legends from "../../LiveDataComponents/Legends";
import Charger from "../../LiveDataComponents/Charger";
import InstantNCharger from "../../LiveDataComponents/InstantNCharger";

const Bar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const {
    Mdata,
    data,
    location,
    charger,
    siteId,liveTime,
  }=useContext(AppContext)
 
  // if (!Mdata) return <div> <Topbar /></div>;
  // if (data.length === 0) return <div> <Topbar /></div>;
  const {packetDateTime}=data || "";
  const device = data[0];
  if (!device || !charger) return <div> <Topbar /></div>;

  const {
    id,
    firstUsedDate,
    batterySerialNumber,
    batteryBankType,
    ahCapacity,
    manifactureName,
    designVoltage,
    individualCellVoltage,
  } = Mdata;
  const {
    
    latitude = 0,                     // Default latitude (could use a fallback like 0 or a center point)
    longitude = 0,                    // Default longitude
    vendorName = "Unknown Vendor",    // Default vendor name
    manufacturerDetails= "Not Specified", // Default battery capacity
    area
  } = location?.siteLocation || {}; // Handle case where location itself might be undefined
  
     
  const {
    deviceId, 
    bmsManufacturerID, 
    serialNumber, 
    installationDate, 
    cellsConnectedCount, 
    problemCells, 
    cellVoltageTemperatureData, 
    stringvoltage, 
    systemPeakCurrentInChargeOneCycle, 
    averageDischargingCurrent, 
    averageChargingCurrent, 
    ahInForOneChargeCycle, 
    ahOutForOneDischargeCycle, 
    cumulativeAHIn, 
    cumulativeAHOut, 
    chargeTimeCycle, 
    dischargeTimeCycle, 
    totalChargingEnergy, 
    totalDischargingEnergy, 
    everyHourAvgTemp, 
    cumulativeTotalAvgTempEveryHour, 
    chargeOrDischargeCycle, 
    socLatestValueForEveryCycle, 
    dodLatestValueForEveryCycle, 
    systemPeakCurrentInDischargeOneCycle, 
    instantaneousCurrent, 
    ambientTemperature, 
    batteryRunHours, 
    bmsAlarmsDTO,
    serverTime
  } = device;


  return (
    <Grid
      container
      direction="column"
      sx={{
        height: "100vh", // Full viewport height
        overflow: "hidden", // Prevent outer overflow
      }}
    >
      {/* Topbar */}
      <Grid item xs="auto">
        <Paper elevation={8}>
          <Topbar
            liveTime={liveTime}
            vendorName={vendorName}
            locationName={area?.name}
          />
        </Paper>
      </Grid>

      {/* Scrollable Content */}
      <Grid
  item
  xs
  container
  spacing={2}
  sx={{
    overflowY: "auto",
    padding: "0px 10px 120px 10px",
    boxSizing: "border-box",
    height: "calc(100vh - 64px)",
  }}
>
  {/* Legends */}
  <Grid item xs={12} sx={{ transition: 'all 0.3s ease-in-out' }}>
    <Paper 
      elevation={8}
      sx={{ 
        boxShadow: '0px 10px 15px rgba(255, 165, 0, 0.4)', // Reduced spread from 20px to 15px
        transition: 'all 0.3s ease-in-out',
        position: 'relative', // Added for z-index context
        zIndex: 1, // Default z-index
        '&:hover': {
          boxShadow: '0px 15px 25px rgba(255, 165, 0, 0.6)', // Reduced spread from 40px to 25px
          transform: 'scale(1.02)',
          zIndex: 2, // Higher z-index on hover
        }
      }}
    >
      <Legends cellVoltageTemperatureData={cellVoltageTemperatureData} />
    </Paper>
  </Grid>

  {/* CellsData and MapWithMarker */}
  <Grid item container spacing={1}>
    <Grid item xs={5} sx={{ transition: 'all 0.3s ease-in-out' }}>
      <Paper 
        elevation={8}
        sx={{ 
          boxShadow: '0px 10px 15px rgba(255, 165, 0, 0.4)',
          transition: 'all 0.3s ease-in-out',
          position: 'relative',
          zIndex: 1,
          '&:hover': {
            boxShadow: '0px 15px 25px rgba(255, 165, 0, 0.6)',
            transform: 'scale(1.02)',
            zIndex: 2,
          }
        }}
      >
        <MapWithMarker
          locationName={area?.name}
          latitude={latitude}
          longitude={longitude}
          vendorName={vendorName}
          batteryAHCapacity={manufacturerDetails}
        />
      </Paper>
    </Grid>
    <Grid item xs={7} sx={{ transition: 'all 0.3s ease-in-out' }}>
      <Paper 
        elevation={8} 
        sx={{ 
          height: "200px",
          overflow: "hidden",
          boxShadow: '0px 10px 15px rgba(255, 165, 0, 0.4)',
          transition: 'all 0.3s ease-in-out',
          position: 'relative',
          zIndex: 1,
          '&:hover': {
            boxShadow: '0px 15px 25px rgba(255, 165, 0, 0.6)',
            transform: 'scale(1.02)',
            zIndex: 2,
          }
        }}
      >
        <CellsData />
      </Paper>
    </Grid>
  </Grid>

  {/* InstantNCharger */}
  <Grid item xs={12} sx={{ transition: 'all 0.3s ease-in-out' }}>
    <Paper 
      elevation={8}
      sx={{ 
        boxShadow: '0px 10px 15px rgba(255, 165, 0, 0.4)',
        transition: 'all 0.3s ease-in-out',
        position: 'relative',
        zIndex: 1,
        '&:hover': {
          boxShadow: '0px 15px 25px rgba(255, 165, 0, 0.6)',
          transform: 'scale(1.02)',
          zIndex: 2,
        }
      }}
    >
      <InstantNCharger
        voltage={stringvoltage}
        current={instantaneousCurrent}
        soc={socLatestValueForEveryCycle}
        dod={dodLatestValueForEveryCycle}
        ambientTemperature={ambientTemperature}
        charger={charger}
        bmsalarms={bmsAlarmsDTO}
      />
    </Paper>
  </Grid>

  {/* Alerts, ManufacturerDetails, and Cumulative */}
  <Grid item container spacing={1}>
    <Grid item xs={6} sx={{ transition: 'all 0.3s ease-in-out' }}>
      <Paper 
        elevation={8}
        sx={{ 
          boxShadow: '0px 10px 15px rgba(255, 165, 0, 0.4)',
          transition: 'all 0.3s ease-in-out',
          position: 'relative',
          zIndex: 1,
          '&:hover': {
            boxShadow: '0px 15px 25px rgba(255, 165, 0, 0.6)',
            transform: 'scale(1.02)',
            zIndex: 2,
          }
        }}
      >
        <Alerts charger={charger} bmsalarms={bmsAlarmsDTO} />
      </Paper>
    </Grid>
    <Grid item xs={3}>
      <Grid container direction="column" spacing={1}>
        <Grid item xs={4} sx={{ transition: 'all 0.3s ease-in-out' }}>
          <Paper 
            elevation={8}
            sx={{ 
              boxShadow: '0px 10px 15px rgba(255, 165, 0, 0.4)',
              transition: 'all 0.3s ease-in-out',
              position: 'relative',
              zIndex: 1,
              '&:hover': {
                boxShadow: '0px 15px 25px rgba(255, 165, 0, 0.6)',
                transform: 'scale(1.02)',
                zIndex: 2,
              }
            }}
          >
            <DischargeCycleWise
              peakDischargeCurrent={systemPeakCurrentInDischargeOneCycle}
              totalSeconds={dischargeTimeCycle}
            />
          </Paper>
        </Grid>
        <Grid item xs={8} sx={{ transition: 'all 0.3s ease-in-out' }}>
          <Paper 
            elevation={8}
            sx={{ 
              boxShadow: '0px 10px 15px rgba(255, 165, 0, 0.4)',
              transition: 'all 0.3s ease-in-out',
              position: 'relative',
              zIndex: 1,
              '&:hover': {
                boxShadow: '0px 15px 25px rgba(255, 165, 0, 0.6)',
                transform: 'scale(1.02)',
                zIndex: 2,
              }
            }}
          >
            <ManufacturerDetails
              firstUsedDate={firstUsedDate}
              batterySerialNumber={batterySerialNumber}
              batteryBankType={batteryBankType}
              serialNumber={serialNumber}
              ahCapacity={ahCapacity}
              manifactureName={manifactureName}
              individualCellVoltage={individualCellVoltage}
              designVoltage={designVoltage}
            />
          </Paper>
        </Grid>
      </Grid>
    </Grid>
    <Grid item xs={3}>
      <Grid container direction="column" spacing={1}>
        <Grid item xs={4} sx={{ transition: 'all 0.3s ease-in-out' }}>
          <Paper 
            elevation={8}
            sx={{ 
              boxShadow: '0px 10px 15px rgba(255, 165, 0, 0.4)',
              transition: 'all 0.3s ease-in-out',
              position: 'relative',
              zIndex: 1,
              '&:hover': {
                boxShadow: '0px 15px 25px rgba(255, 165, 0, 0.6)',
                transform: 'scale(1.02)',
                zIndex: 2,
              }
            }}
          >
            <ChargeCycleWise
              PeakChargeCurrent={systemPeakCurrentInChargeOneCycle}
              totalSeconds={chargeTimeCycle}
            />
          </Paper>
        </Grid>
        <Grid item xs={8} sx={{ transition: 'all 0.3s ease-in-out' }}>
          <Paper 
            elevation={8}
            sx={{ 
              boxShadow: '0px 10px 15px rgba(255, 165, 0, 0.4)',
              transition: 'all 0.3s ease-in-out',
              position: 'relative',
              zIndex: 1,
              '&:hover': {
                boxShadow: '0px 15px 25px rgba(255, 165, 0, 0.6)',
                transform: 'scale(1.02)',
                zIndex: 2,
              }
            }}
          >
            <Cummulative
              chargeDischargeCycles={chargeOrDischargeCycle}
              ampereHourIn={cumulativeAHIn}
              ampereHourOut={cumulativeAHOut}
              chargingEnergy={totalChargingEnergy}
              dischargingEnergy={totalDischargingEnergy}
              time={batteryRunHours}
            />
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  </Grid>
</Grid>
    </Grid>
  );
};

export default Bar;