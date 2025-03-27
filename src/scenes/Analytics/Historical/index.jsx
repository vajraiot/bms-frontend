import React, { useContext, useState } from "react";
import { useTheme, IconButton, CircularProgress, Box } from "@mui/material";
import { AppContext, formatDate } from "../../../services/AppContext";
import ReportsBar from "../ReportsBar/ReportsBar";
import excelIcon from "../../../assets/images/png/ExcellTrans100_98.png";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TablePagination,
  TableSortLabel,
} from "@mui/material";
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
    data = {}, 
    page, 
    setPage, 
    rowsPerPage, 
    setRowsPerPage, 
    siteId,
    serialNumber,
    startDate, 
    endDate, 
    totalRecords,
    loadingReport // Using the loading state from your context
  } = useContext(AppContext);
  
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("packetDateTime");

  const handleRequestSort = (property) => {
    const isAscending = orderBy === property && order === "asc";
    setOrder(isAscending ? "desc" : "asc");
    setOrderBy(property);
  };

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

  const dataArray = Array.isArray(data.content) ? data.content : [data];

  const sortedData = React.useMemo(() => {
    return [...dataArray].sort((a, b) => {
      const valueA = a[orderBy];
      const valueB = b[orderBy];
      
      if (order === "asc") {
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      }
      return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
    });
  }, [dataArray, order, orderBy]);

  const displayedColumns = Object.keys(columnMappings);

  const handleDownloadExcel = () => {
    downloadHistoricalBatteryandChargerdetails(
      siteId,
      serialNumber,
      formatDate(startDate),
      formatDate(endDate)
    );
  };

  return (
    <div>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "10px" 
      }}>
        <ReportsBar pageType="historical" />
        <IconButton 
          onClick={handleDownloadExcel} 
          color="primary" 
          aria-label="Download Excel"
          disabled={loadingReport}
        >
          <img src={excelIcon} alt="Download Excel" style={{ width: "24px", height: "24px" }} />
        </IconButton>
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
      ) : sortedData.length > 0 && Object.keys(data).length > 0 ? (
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
                      <TableSortLabel
                        active={orderBy === key}
                        direction={orderBy === key ? order : "asc"}
                        onClick={() => handleRequestSort(key)}
                      >
                        {columnMappings[key]}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedData
                //  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
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
            rowsPerPageOptions={[5, 100, 200,300,500]}
            component="div"
            count={totalRecords}
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