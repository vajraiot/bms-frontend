import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme.js";
import dtIcon from "../assets/images/png/run hours.png";
import pdcIcon from "../assets/images/png/Ah capacity.png"; // Icon for Peak Discharge Current

export default function DischargeCycleWise({
  peakDischargeCurrent,
  averageDischargingCurrent,
  ahOutForOneDischargeCycle,
  totalSeconds,
}) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const dischargeTime = (totalSeconds = 0) => {
    try {
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      // Format hours, minutes, and seconds with leading zeros
      const hr = hours < 10 ? "0" + hours : hours;
      const mn = minutes < 10 ? "0" + minutes : minutes;
      const sc = seconds < 10 ? "0" + seconds : seconds;

      return `${hr}:${mn}:${sc}`;
    } catch (error) {
      return "--";
    }
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
        <Typography variant="h6" mb="1px" sx={{ alignSelf: "center" }}>
          <strong>Discharge Cycle Info</strong>
        </Typography>
        <Box display="flex" flexDirection="column">
          {[
            { label: "Charge Current", value: peakDischargeCurrent, unit: "A", icon: pdcIcon },
            { label: "Run Time", value: dischargeTime(totalSeconds), icon: dtIcon },
          ].map(({ label, value, unit, icon }, index) => (
            <Box
              key={index}
              display="flex"
              alignItems="center"
              justifyContent="flex-start"
              gap="8px"
            >
              {/* Render the icon if available */}
              🔹
              <Typography
                variant="h6"
                fontWeight="bold"
                style={{ minWidth: "170px" }}
              >
                {label}
              </Typography>
              <Typography variant="h6"   fontWeight="bold" style={{ color: "inherit" }}>
                :
              </Typography>
              <Typography  fontWeight="bold" variant="h6" style={{ color: "#000f89"}}>
                {value}{" "} {unit || ""}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
