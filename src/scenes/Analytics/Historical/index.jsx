import React, { useContext, useState } from "react";
import {
  useTheme,
  IconButton,
  CircularProgress,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Typography,
  TablePagination,
} from "@mui/material";
import { AppContext, formatDate } from "../../../services/AppContext";
import ReportsBar from "../ReportsBar/ReportsBar";
import GridOnIcon from '@mui/icons-material/GridOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { downloadHistoricalBatteryandChargerdetails } from '../../../services/apiService';

const columnMappings = {
  serverTime: "Server Date Time",
  packetDateTime: "Packet Date Time",
  cellsConnectedCount: "Connected Cells",
  problemCells: "Problem Cells",
  stringVoltage: "String Voltage (V)",
  systemPeakCurrentInChargeOneCycle: "Peak Charge Current (A)",
  averageDischargingCurrent: "Avg Discharge Current (A)",
  averageChargingCurrent: "Avg Charge Current (A)",
  ahInForOneChargeCycle: "Charge Capacity (Ah)",
  ahOutForOneDischargeCycle: "Discharge Capacity (Ah)",
  cumulativeAHIn: "Total Charge (Ah)",
  cumulativeAHOut: "Total Discharge (Ah)",
  chargeTimeCycle: "Charge Time (s)",
  dischargeTimeCycle: "Discharge Time (s)",
  totalChargingEnergy: "Charging Energy (kWh)",
  totalDischargingEnergy: "Discharging Energy (kWh)",
  everyHourAvgTemp: "Hourly Avg Temp (°C)",
  cumulativeTotalAvgTempEveryHour: "Cumulative Avg Temp (°C)",
  chargeOrDischargeCycle: "Cycle Count",
  socLatestValueForEveryCycle: "SOC (%)",
  dodLatestValueForEveryCycle: "DOD (%)",
  systemPeakCurrentInDischargeOneCycle: "Peak Discharge Current (A)",
  instantaneousCurrent: "Current (A)",
  ambientTemperature: "Ambient Temp (°C)",
  acVoltage: "AC Voltage (V)",
  acCurrent: "AC Current (A)",
  frequency: "Frequency (Hz)",
  energy: "Energy (kWh)",
  batteryRunHours: "Run Hours",
};

const Historical = () => {
  const theme = useTheme();
  const { 
    realTimeData = {}, 
    page, 
    setPage, 
    rowsPerPage, 
    setRowsPerPage, 
    siteId,
    serialNumber,
    startDate, 
    endDate, 
    totalRecords,
    loadingReport
  } = useContext(AppContext);
  
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const formatTimeStamp = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    });
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "00:00:00";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatNumber = (value, decimals = 2) => {
    if (value === null || value === undefined) return "N/A";
    return Number(value).toFixed(decimals);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDownloadExcel = async () => {
    if (siteId && serialNumber && startDate && endDate) {
      try {
        setIsDownloading(true);
        setDownloadComplete(false);
        
        await downloadHistoricalBatteryandChargerdetails(
          siteId,
          serialNumber,
          formatDate(startDate),
          formatDate(endDate)
        );
        
        setIsDownloading(false);
        setDownloadComplete(true);
        
        setTimeout(() => {
          setDownloadComplete(false);
        }, 2000);
      } catch (error) {
        console.error("Download failed:", error);
        setIsDownloading(false);
      }
    }
  };

  const dataArray = Array.isArray(realTimeData.content) ? realTimeData.content : [realTimeData];
  const displayedColumns = Object.keys(columnMappings);

  return (
    <div>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "10px" 
      }}>
        <ReportsBar pageType="historical" />
        <Tooltip title="Export to Excel">
          <Box sx={{ position: 'relative', marginRight: '20px' }}>
            <IconButton
              onClick={handleDownloadExcel}
              disabled={loadingReport || !siteId || !startDate || !endDate || isDownloading}
              sx={{
                backgroundColor: '#4caf50',
                color: 'white',
                '&:hover': { backgroundColor: '#388e3c' },
                '&.Mui-disabled': { backgroundColor: '#4caf50', opacity: 0.5 },
              }}
            >
              {downloadComplete ? (
                <CheckCircleIcon />
              ) : (
                <GridOnIcon />
              )}
            </IconButton>
            {isDownloading && (
              <CircularProgress
                size={40}
                sx={{
                  color: '#4caf50',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-20px',
                  marginLeft: '-20px',
                }}
              />
            )}
          </Box>
        </Tooltip>
      </div>

      {loadingReport ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "379px",
            flexDirection: "column",
            gap: 2
          }}
        >
          <CircularProgress />
          <Typography variant="body1">Loading historical data...</Typography>
        </Box>
      ) : dataArray.length > 0 && Object.keys(realTimeData).length > 0 ? (
        <>
          <TableContainer
            component={Paper}
            sx={{
              marginTop: 1,
              overflowX: "auto",
              border: "1px solid black",
              borderRadius: "8px",
              maxHeight: "379px",
            }}
          >
            <Table stickyHeader aria-label="battery monitoring table">
              <TableHead>
                <TableRow>
                  {displayedColumns.map((key) => (
                    <TableCell
                      key={key}
                      sx={{
                        fontWeight: "bold",
                        background: "linear-gradient(to bottom, #d82b27, #f09819)",
                        color: "#ffffff",
                        padding: "3px",
                        minWidth: "150px",
                        whiteSpace: "nowrap",
                        textAlign: "center"
                      }}
                    >
                      {columnMappings[key]}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {dataArray.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:hover": { backgroundColor: "#e1e2fe" } }}
                  >
                    {displayedColumns.map((key) => (
                      <TableCell
                        key={key}
                        sx={{
                          border: "1px solid #ccc",
                          padding: "3px",
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                          textAlign: "center"
                        }}
                      >
                        {key === "packetDateTime" || key === "serverTime"
                          ? formatTimeStamp(row[key])
                          : (key === "chargeTimeCycle" || 
                             key === "dischargeTimeCycle" || 
                             key === "batteryRunHours")
                          ? formatDuration(row[key])
                          : formatNumber(row[key])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[50, 100, 200, 300, 500]}
            component="div"
            count={totalRecords || dataArray.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      ) : (
        <Typography variant="body1" sx={{ marginTop: 2, textAlign: "center" }}>
          No data available
        </Typography>
      )}
    </div>
  );
};

export default Historical;