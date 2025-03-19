import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme.js";
import Calendar from "../assets/images/png/calendar.png";
import BatterySerialNumber from "../assets/images/png/battery.png";
import typeOfBatteryBank from "../assets/images/png/type of BB.png";
import ah from "../assets/images/png/Ah capacity.png";
import mfname from "../assets/images/png/mfname.png";



function ManufacturerDetails({
  firstUsedDate,
  batterySerialNumber,
  batteryBankType,
  ahCapacity,
  manifactureName,
  individualCellVoltage,
  designVoltage
}) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const iconMap = {
    "First Used Date": Calendar,
    "Battery Serial Number": BatterySerialNumber,
     "Type of Battery Bank": typeOfBatteryBank,
     "Ah Capacity": ah,
    "Manufacturer Name": mfname,
     "Design Voltage":BatterySerialNumber,
     "Individual Cell Voltage": BatterySerialNumber,
  };

  return (
    <Box>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="flex-start"
      
        ml="8px"
       
      >
        <Typography sx={{ alignSelf: "center"}}  variant="h6" mb="10px">
          <strong>Manufacturer Info</strong>
        </Typography>
        <Box display="flex" flexDirection="column">
          {[
            { label: "First Used Date", value: new Date(firstUsedDate ).toLocaleString('en-GB', {
              day: 'numeric',
              month: 'numeric',
              year: 'numeric',
              hour12: false
            })   },
            { label: "Battery Serial Number", value: batterySerialNumber },
            { label: "Type of Battery Bank", value: batteryBankType },
            { label: "Ah Capacity", value: ahCapacity, unit:"Ah" },
            { label: "Manufacturer Name", value: manifactureName },
            { label: "Design Voltage", value: designVoltage, unit:"V" },
            { label: "Individual Cell Voltage", value: individualCellVoltage ,unit:"V"},
          ].map(({ label, value, unit }, index) => (
            <Box
              key={index}
              display="flex"
              alignItems="center"
              justifyContent="flex-start"
              gap="8px"
      
            >
              🔹
              <Typography variant="h6" fontWeight="bold" style={{ minWidth: "150px" }}>
                {label}
              </Typography>
              <Typography variant="h6"  fontWeight="bold" style={{ color: "inherit" }}>
                :
              </Typography>
              <Typography variant="h6"  fontWeight="bold" style={{ color: "#000f89" }}>
                {value}{" "}  {unit} 
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default ManufacturerDetails;
