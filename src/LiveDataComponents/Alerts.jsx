import React,{useContext,useMemo } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import {Grid,Tooltip,useTheme,Box,Typography,Grid, Card, CardContent} from "@mui/material";
import {tokens} from "../theme"
import PowerIcon from "@mui/icons-material/Power"; 
import { AlertTriangle, BatteryFull ,Power,BatteryLow,BatteryMedium ,CirclePower,Activity} from 'lucide-react';
import fuse from '.././enums/electronic-fuse.png'
import { ChargerTrip, StringCurrent, ACVoltage, DCVoltage, Buzzer,AnimatedFuseIcon, ChargerLoadIcon, StringCommunicationIcon } from '.././enums/ThresholdValues'

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
import{ToggleLeft,Radio} from 'lucide-react';
import { tokens } from "../theme";
import {
  Warning as AlertTriangle,
  BatteryFull as BatteryFull,
  Power as Power,
  TripOrigin as ChargerTrip,
  Bolt as ACVoltage,
  BatteryChargingFull as DCVoltage,
  NotificationsActive as Buzzer
} from '@mui/icons-material';
import {Charging,Discharging,FuseIcon} from '../enums/ThresholdValues'
import { AppContext } from "../services/AppContext";
const Alerts = () => {
  const { data, charger } = useContext(AppContext);
  const device = data[0];
  const theme = useTheme();

  if (!device || !charger[0]) {
    return <div>Loading...</div>;
  }

  const { bmsalarms } = device;
  const chargerStatusData = charger[0]?.chargerStatusData || {};
  const combinedData = { ...bmsalarms, ...chargerStatusData };

  const detailsMap = {
    bankCycleDC: "Battery status",
    bmsSedCommunicationFD: "String Commun",
    buzzer: "Buzzer",
    cellVoltageLHN: "Cell Voltage",
    inputMains: "Input Mains",
    inputFuse: "Input Fuse",
    rectifierFuse: "Rectifier fuse",
    filterFuse: "Filter Fuse",
    inputPhase:"Input phase",
    dcVoltageOLN: "DC Voltage",
    outputFuse: "Output Fuse",
    chargerLoad: "Charger Load",
    alarmSupplyFuse: "Alarm Fuse",
    chargerTrip: "Charger Trip",
    outputMccb: "Output Mccb",
    acVoltageULN: "AC Voltage",
    batteryCondition: "Battery Condition",
    resetPushButton: "Reset Button",
  };

  const getSeverityFromBit = (bit, key) => {
    // If key is acVoltageULN, always return Activity as IconComponent
    if (key === "acVoltageULN") {
        switch (bit) {
            case 0:
                return { status: "Low", severity: "low", IconComponent: Activity };
            case 1:
                return { status: "Normal", severity: "medium", IconComponent: Activity };
            case 2:
                return { status: "High", severity: "high", IconComponent: Activity };
            default:
                return { status: "Unknown", severity: "medium", IconComponent: Activity };
        }
    }

    // For other keys (cellVoltageLHN and dcVoltageOLN), use the original logic
    switch (bit) {
        case 0:
            return { status: "Low", severity: "low", IconComponent: BatteryLow };
        case 1:
            return { status: "Normal", severity: "medium", IconComponent: BatteryMedium };
        case 2:
            return { status: "High", severity: "high", IconComponent: BatteryFull };
        default:
            return { status: "Unknown", severity: "medium" };
    }
};

  const alerts = useMemo(() => {
    return Object.keys(detailsMap).map((key, index) => {
      let status = "Unknown";
      let severity = "medium";
      let IconComponent = null;

      // Logic for status and severity
      if (key === "cellVoltageLHN" || key === "dcVoltageOLN" || key === "acVoltageULN") {
        const bitValue = combinedData[key];
        ({ status, severity, IconComponent } = getSeverityFromBit(bitValue, key));
    } else if (key === "chargerTrip") {
        status = combinedData[key] ? "" : "";
        severity = combinedData[key] ? "high" : "medium";
      } else if (key === "bankCycleDC") {
        status = combinedData[key] ? "" : "";
        severity = combinedData[key] ? "high" : "medium";
      } else {
        status = combinedData[key] ? "" : "";
        severity = combinedData[key] ? "high" : "medium";
      }

      // Assign the appropriate SVG component based on the alert type
     if (key === "bmsSedCommunicationFD") {
        IconComponent=  StringCommunicationIcon;
      }else if (key === "chargerTrip") {
        IconComponent = ChargerTrip;
      }
      //  else if (key === "acVoltageULN") {
      //   IconComponent = ACVoltage;
      // } else if (key === "dcVoltageOLN") {
      //   IconComponent = DCVoltage;
      // }
       else if (key === "resetPushButton") {
        IconComponent =CirclePower;
      } else if (key === "inputMains") {
        IconComponent = () => <Power size={20} style={{ color: "#B71C1C" }} />;
      } else if (key === "buzzer") {
        IconComponent = Buzzer;
      } else if (key === "batteryCondition") {
        IconComponent = BatteryFull;
      } else if (key === "outputMccb") {
        IconComponent = () => <ToggleLeft size={20}  />;
      }

      if (key === "inputMains" ) {
        IconComponent = () =>
          combinedData[key] =
           <PowerIcon size={25} color="#B71C1C" />
      } if (key === "inputPhase" ) {
        IconComponent = () =>
          combinedData[key] =
           <PowerIcon size={25} color="#B71C1C" />
      }
      
      if (key === "chargerLoad" ) {
        IconComponent =ChargerLoadIcon   
      }
      // if (
      //   key === "cellVoltageLHN") {
      //   IconComponent =()=> <BatteryLow />
      // }
      // Use AlertTriangle for Failure, Low, High, Tripped states
      if (severity === "high") {
        IconComponent = () => <AlertTriangle size={20} style={{ color: "#B71C1C" }} />;
      }
      if (key === "bankCycleDC") {
        IconComponent = combinedData[key] ? Discharging : Charging;
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
           <AnimatedFuseIcon size={25} color="#B71C1C" strokeWidth={1.5} isBroken={true} />
          ) : (
            <AnimatedFuseIcon size={25} color="#1B5E20" strokeWidth={1.5} isBroken={false} />
          );
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
        return { backgroundColor: "#FFCDD2", color: "#B71C1C" };
      case "medium":
        return { backgroundColor: "#C8E6C9", color: "#1B5E20" };
      case "low":
        return { backgroundColor: "#FFF3E0", color: "#FFAE42" };
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
      pb="25px"
    >
      <Typography variant="h6" sx={{ alignSelf: "center", fontWeight: "bold" }}>
        Alarms Info
      </Typography>
      <Grid
        container
        spacing={1}
        justifyContent="center"
        alignItems="center"
        sx={{ padding: "15px 8px 20px 8px", width: "100%" }}
      >
        {alerts.map((alert) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={alert.id}>
            <Card
              style={{
                ...getSeverityStyles(alert.severity),
                borderRadius: 8,
                transition: "transform 0.3s ease",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
                minWidth: 60,
                height: 60,
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <CardContent style={{ textAlign: "center", padding: 3 }}>
                <div>
                  {alert.IconComponent ? (
                    <alert.IconComponent />
                  ) : (
                    <>
                      {alert.severity === "high" && (
                        <AlertTriangle size={20} style={{ color: "#B71C1C" }} />
                      )}
                      {alert.severity === "medium" && (
                        <BatteryFull size={20} style={{ color: "#F57F17" }} />
                      )}
                      {alert.severity === "low" && (
                        <AlertTriangle size={20} style={{ color: "#0D47A1" }} />
                      )}
                    </>
                  )}
                </div>
                <Typography variant="body2" sx={{ fontSize: 9, fontWeight: "bold" }}>
                  {alert.details}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Alerts;

