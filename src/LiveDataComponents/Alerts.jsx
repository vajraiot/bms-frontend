import React,{useContext,useMemo } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import {Grid,Tooltip,useTheme,Box,Typography,Grid, Card, CardContent} from "@mui/material";
import {tokens} from "../theme"
import PowerIcon from "@mui/icons-material/Power"; 
import { AlertTriangle, BatteryFull ,Power,BatteryLow,BatteryMedium ,CirclePower,Activity} from 'lucide-react';
import fuse from '.././enums/electronic-fuse.png'
import { ChargerTrip, StringCurrent, ACVoltage, DCVoltage, Buzzer,BatteryStringIcon,AnimatedFuseIcon,ACVoltageIcon,DCVoltageIcon,ChargerLoadIcon, StringCommunicationIcon } from '.././enums/ThresholdValues'
import trip from '.././assets/images/png/fuse-box.png'
import InputMains from '.././assets/images/InputMains.png';
import chargerloadO from '.././assets/images/ChargerLoadO.png';
import chargerload from '.././assets/images/ChargerLoadN.png';
import InputPhase from '.././assets/images/InputPhase.png';
import InputPhaseF from '.././assets/images/inputphaseF.png';

import mccb from '.././assets/images/png/circuit-breaker.png'
import acNV from '.././assets/images/png/ac-voltage.png'
import acLV from '.././assets/images/png/ac-voltage-source.png'
import acHV from '.././assets/images/png/air.png'
import {
  Box,
  Paper,
  Typography,
  Button,
  Modal,
  useTheme,
  Container,
  Grid,
  Card,CardContent
} from "@mui/material";
import { tokens } from "../theme";
import {
  Warning as AlertTriangle,
  Power as Power,
  TripOrigin as ChargerTrip,
  Bolt as ACVoltage,
  BatteryChargingFull as DCVoltage,
  NotificationsActive as Buzzer
} from '@mui/icons-material';
import {ChargingV,DischargingV,FuseIcon} from '../enums/ThresholdValues'
import { AppContext } from "../services/AppContext";
const Alerts = () => {
  const { data, charger } = useContext(AppContext);
  const device = data[0];
  const theme = useTheme();

  if (!device || !charger[0]) {
    return <div>Loading...</div>;
  }

  const { bmsAlarmsDTO } = device;
  const chargerDTO = charger[0]?.chargerDTO || {};
  const combinedData = { ...bmsAlarmsDTO, ...chargerDTO };
  console.log("bmsAlarmsDTO:", bmsAlarmsDTO);
  console.log("chargerDTO:", chargerDTO);
  const detailsMap = {
    bankDischargeCycle: "Battery status",
    dcVoltageOLN: "DC Voltage",
    bmsSedCommunicationFD: "String Commun",
    batteryCondition: "Battery Condition",
    chargerLoad: "Charger Load",
    inputMains: "Input Mains",
    inputPhase:"Input phase",
    acVoltageULN: "AC Voltage",
    chargerTrip: "Charger Trip",
    
    buzzer: "Buzzer",
    rectifierFuse: "Rectifier fuse",
   
    
    filterFuse: "Filter Fuse",
   
  
    outputFuse: "Output Fuse",
   
    

    inputFuse: "Input Fuse",
    alarmSupplyFuse: "Alarm Fuse",
    outputMccb: "Output Mccb",
    resetPushButton: "Reset Button",


  };

  const getSeverityFromBit = (bit, key) => {
    // If key is acVoltageULN, always return Activity as IconComponent
    if (key === "acVoltageULN") {
        switch (bit) {
            case 0:
                return { status: "Low", severity: "low", IconComponent:()=> <ACVoltageIcon size={25} color="orange" strokeWidth={1.5}  /> };
            case 1:
                return { status: "Normal", severity: "medium", IconComponent: ()=> <ACVoltageIcon size={25} color="rgb(50, 149, 56)" strokeWidth={1.5} />};
            case 2:
                return { status: "High", severity: "high", IconComponent: ()=> <ACVoltageIcon size={25} color="rgb(183, 28, 28)" strokeWidth={1.5}  />};
            default:
                return { status: "Unknown", severity: "medium", IconComponent: ()=> <img src={acNV} style={{width:23}}></img> };
        }
    }

    // For other keys (cellVoltageLHN and dcVoltageOLN), use the original logic
    switch (bit) {
      case 0:
        return { status: "Low", severity: "low", IconComponent: () => <DCVoltageIcon size={30} isActive={true} state="low" /> };
      case 1:
        return { status: "Normal", severity: "medium", IconComponent: () => <DCVoltageIcon size={30} isActive={true} state="normal" /> };
      case 2:
        return { status: "High", severity: "high", IconComponent: () => <DCVoltageIcon size={30} isActive={true} state="over" /> };
      default:
        return { status: "Unknown", severity: "medium", IconComponent: () => <BatteryLow  size={20} /> };
    }
};

  const alerts = useMemo(() => {
    return Object.keys(detailsMap).map((key, index) => {
      let status = "Unknown";
      let severity = "medium";
      let IconComponent = null;
      if (key === "chargerTrip") {
        status = combinedData[key] ? "" : "";
        severity = combinedData[key] ? "high" : "medium";
      } else {
        status = combinedData[key] ? "" : "";
        severity = combinedData[key] ? "high" : "medium";
      }
      if (key === "chargerTrip") {
        IconComponent =()=> <img src={trip} alt="" style={{width:30}}/>;
      }
      else if (key === "inputMains"||key === "inputPhase" ) {
        IconComponent = () =><img src={InputMains} alt="" style={{width:25}} />
      }
       else if (key === "resetPushButton") {
        IconComponent =CirclePower;
      // } else if (key === "inputMains") {
      //   IconComponent = () => <Power  style={{ color: "#B71C1C" ,fontSize:"2rem"}} />;
      } else if (key === "buzzer") {
        IconComponent = Buzzer;
      
      } else if (key === "outputMccb") {
        IconComponent = () => <img src={mccb} alt="" style={{width:30}} />;
      }

      if (key === "inputMains"||key === "inputPhase" ) {
        IconComponent = () =>
          combinedData[key]?<img src={InputMains} alt="" style={{width:"20px",height:"30px"}} />:<img src={InputMains} alt="" style={{width:"20px",height:"30px"}} />
         
      } 
 
      if (severity === "high") {
        IconComponent = () => <AlertTriangle size={20} style={{ color: "#B71C1C" }} />;
      }
      if (key === "cellVoltageLNH" || key === "dcVoltageOLN" || key === "acVoltageULN") {
        const bitValue = combinedData[key];
        ({ status, severity, IconComponent } = getSeverityFromBit(bitValue, key));
    } 
      if (key === "bankDischargeCycle") {
        IconComponent = combinedData[key] ? DischargingV : ChargingV ;
        severity =combinedData[key] ? "medium":"medium"
      } 
      if (key === "batteryCondition") {
        IconComponent = ()=>combinedData[key]? <DCVoltageIcon size={50} isActive={true} state="low" />:<DCVoltageIcon size={30} isActive={true} state="normal" />;
        severity =combinedData[key] ? "low":"medium"
      }
      // Fuse icons
      if (
        key === "inputFuse" ||
        key === "rectifierFuse" ||
        key === "filterFuse" ||
        key === "outputFuse" ||
        key === "alarmSupplyFuse"
      ) {
        IconComponent = () =>
          combinedData[key] ? (
           <AnimatedFuseIcon size={14}  color="rgb(183, 28, 28)" strokeWidth={1.5} isBroken={true} />
          ) : (
            <AnimatedFuseIcon size={14} color="rgb(50, 149, 56)" strokeWidth={1.5} isBroken={false} />
          );
      }
      if (key === "bmsSedCommunicationFD") {
        IconComponent =()=> combinedData[key]?<BatteryStringIcon size={25} isActive={false} 
        strokeWidth={1.5}  />:<BatteryStringIcon size={18} isActive={true} strokeWidth={1.5}  />
        }

        if (key === "chargerLoad" ) {
          IconComponent =()=> combinedData[key]?<img src={chargerloadO} style={{width:35}}></img>:<img src={chargerload} style={{width:35}}></img> 
        }
        if (key === "chargerTrip" ) {
          IconComponent = () =>
            combinedData[key] ?<img src={InputPhase} style={{width:28}}></img>:<img src={InputPhaseF} style={{width:28}}></img> 
        }

      return {
        id: index + 1,
        status,
        details: detailsMap[key],
        severity,
        IconComponent,
      };
    });
  }, [combinedData]);

  const getSeverityStyles = (severity) => {
    switch (severity) {
      case "high":
        return { backgroundColor: "rgb(183, 28, 28)", color: "#ffff" };
      case "medium":
        return { backgroundColor: "rgb(27, 94, 32)", color: "#ffff" };
      case "low":
        return { backgroundColor: "orange", color: "#ffff" };
      default:
        return { backgroundColor: "#ECEFF1", color: "#455A64" };
    }
  };

  const getSeverityStyles1 = (severity) => {
    switch (severity) {
      case "high":
        return { backgroundColor: "#ffff", color: "rgb(183, 28, 28)" };
      case "medium":
        return { backgroundColor: "#ffff", color: "rgb(27, 94, 32)" };
      case "low":
        return { backgroundColor: "ffff", color: "#orange" };
      default:
        return { backgroundColor: "#ECEFF1", color: "#455A64" };
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      width="100%"
      height="100%"
      pb="7px"
    >
      <Typography variant="h6" sx={{ alignSelf: "center", fontWeight: "bold" }}>
        Alarms Info
      </Typography>
      <Grid
  container
  spacing={1}
  justifyContent="center"
  alignItems="center"
  gap={1}
  sx={{ padding: "5px 2px 5px 8px", width: "100%" }}
>
  {alerts.map((alert) => (
    <Grid item xs={12} sm={6} md={4} lg={2} key={alert.id}>
     <Card
        style={{
          border: "1px solid #ccc",
          borderRadius: 8,
          transition: "transform 0.3s ease",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          cursor: "pointer",
          minWidth: 100,
          // Remove fixed height or use minHeight to allow growth
          minHeight: 45, // Changed from height: 45
          display: "flex",
          flexDirection: "row",
          overflow: "hidden",
        }}
        onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        {/* Icon Section */}
        <Box
          sx={{
            width: "30%", // Keep this, but ensure it doesn't overly constrain the SVG
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0.5, // Reduced padding to give more space to the SVG
            ...getSeverityStyles1(alert.severity),
            backgroundColor: "#fff", // Fixed typo: '#ffff' -> '#fff'
          }}
        >
          {alert.IconComponent ? (
            <alert.IconComponent />
          ) : (
            <>
              {alert.severity === "high" && (
                <AlertTriangle size={20} style={{ color: "#B71C1C" }} />
              )}
              {alert.severity === "medium" && (
                <AlertTriangle size={20} style={{ color: "#F57F17" }} />
              )}
              {alert.severity === "low" && (
                <AlertTriangle size={20} style={{ color: "#0D47A1" }} />
              )}
            </>
          )}
        </Box>

        {/* Text Section */}
        <Box
          sx={{
            width: "70%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 1,
            ...getSeverityStyles(alert.severity),
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontSize: 9,
              fontWeight: "bold",
              textAlign: "center",
              wordBreak: "break-word",
            }}
          >
            {alert.details}
          </Typography>
        </Box>
      </Card>
    </Grid>
  ))}
</Grid>
    </Box>
  );
};

export default Alerts;

