import React from 'react';
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme.js";
import peakChargeIcon from "../assets/images/png/run hours.png"; // Replace with correct icon path
import chargeTimeIcon from "../assets/images/png/Ah capacity.png"; // Replace with correct icon path

function ChargeCycleWise({ PeakChargeCurrent, totalSeconds }) {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const ChargeTime = (totalSeconds = 0) => {
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
                <Typography sx={{ alignSelf: "center" }} variant="h6">
                    <strong>Charge Cycle Info</strong>
                </Typography>
                <Box display="flex" flexDirection="column">
                    {[
                        { label: "Peak Charge Current", value: PeakChargeCurrent, unit: "A", icon: peakChargeIcon },
                        { label: "Charge Time", value: ChargeTime(totalSeconds), icon: chargeTimeIcon },
                    ].map(({ label, value, unit, icon }, index) => (
                        <Box
                            key={index}
                            display="flex"
                            alignItems="center"
                            justifyContent="flex-start"
                            gap="8px"
                        >
                            {/* Icon */}
                            <img src={icon} alt={label} width="13px" height="13px" />

                            {/* Label */}
                            <Typography
                                variant="h5"
                                fontWeight="bold"
                                style={{ minWidth: "130px" }}
                            >
                                {label}
                            </Typography>

                            {/* Colon */}
                            <Typography
                                variant="h5"
                                style={{ color: "inherit" }}
                            >
                                :
                            </Typography>

                            {/* Value */}
                            <Typography
                                variant="h5"
                                style={{ color: colors.greenAccent[500] }}
                            >
                                {value}{" "}{unit}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}

export default ChargeCycleWise;
