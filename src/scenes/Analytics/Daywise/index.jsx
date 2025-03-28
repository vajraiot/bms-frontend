import React, { useContext, useState } from "react";
import { 
  useTheme, 
  IconButton, 
  Box, 
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TablePagination,
  Tooltip
} from "@mui/material";
import { AppContext, formatDate } from "../../../services/AppContext";
import ReportsBar from "../ReportsBar/ReportsBar";
import ChargingGraph from "./ChargingGraph";
import AhGraph from "./AhGraph";
import { formatToTime } from "../../../services/AppContext";
import GridOnIcon from '@mui/icons-material/GridOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { downloadDayWiseBatteryandChargerdetails } from '../../../services/apiService';

const columnMappings = {
  dayWiseDate: "Date",
  chargeOrDischargeCycle: "Charge/Discharge Cycle",
  cumulativeAHIn: "Cumulative AH In (AH)",
  cumulativeAHOut: "Cumulative AH Out (AH)",
  totalChargingEnergy: "Total Charging Energy (KWH)",
  totalDischargingEnergy: "Total Discharging Energy (KWH)",
  batteryRunHours: "Battery Run Hours",
  totalSoc: "SOC (%)",
  cumulativeTotalAvgTemp: "Temperature(°C)",
};

const DayWise = () => {
  const theme = useTheme();
  const { 
    dayDaywiseData = [],  
    page, 
    setPage, 
    setRowsPerPage, 
    rowsPerPage,
    siteId,
    serialNumber,
    startDate, 
    endDate, 
    totalRecords,
    loadingReport 
  } = useContext(AppContext);

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatNumber = (value, decimals = 2) => {
    if (value === null || value === undefined) return "-";
    return Number(value).toFixed(decimals);
  };

  const formatData = (data) => {
    const dataArray = Array.isArray(data) ? data : data.content || [];
    if (!dataArray.length) return [];

    return dataArray.map((row) => {
      const {
        dayWiseDate,
        batteryRunHours,
        chargeOrDischargeCycle,
        cumulativeAHIn,
        cumulativeAHOut,
        totalChargingEnergy,
        totalDischargingEnergy,
        totalSoc,
        cumulativeTotalAvgTemp
      } = row;

      const formattedDate = dayWiseDate ? dayWiseDate.split("T")[0] : "No Date";

      return {
        dayWiseDate: formattedDate,
        batteryRunHours: formatToTime(batteryRunHours || 0),
        chargeOrDischargeCycle: chargeOrDischargeCycle || "-",
        cumulativeAHIn: formatNumber(cumulativeAHIn),
        cumulativeAHOut: formatNumber(cumulativeAHOut),
        totalChargingEnergy: formatNumber(totalChargingEnergy),
        totalDischargingEnergy: formatNumber(totalDischargingEnergy),
        totalSoc: formatNumber(totalSoc),
        cumulativeTotalAvgTemp: formatNumber(cumulativeTotalAvgTemp),
      };
    });
  };

  const formattedData = formatData(dayDaywiseData);

  const handleDownloadExcel = async () => {
    if (!siteId || !serialNumber || !startDate || !endDate) {
      return;
    }

    try {
      setIsDownloading(true);
      setDownloadComplete(false);

      await downloadDayWiseBatteryandChargerdetails(
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
  };

  return (
    <div>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "10px" 
      }}>
        <ReportsBar pageType="daywise" />
        <Tooltip title="Export to Excel">
          <Box sx={{ position: 'relative', marginRight: '20px' }}>
            <IconButton
              onClick={handleDownloadExcel}
              disabled={loadingReport || isDownloading || !siteId || !serialNumber || !startDate || !endDate}
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

      <Box
        sx={{
          height: "calc(100vh - 200px)",
          overflowY: "auto",
          padding: "10px",
        }}
      >
        {loadingReport ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              flexDirection: "column",
              gap: 2
            }}
          >
            <CircularProgress />
            <Typography variant="body1">Loading day-wise data...</Typography>
          </Box>
        ) : formattedData.length > 0 ? (
          <>
            <div style={{ paddingBottom: "10px" }}>
              <Box paddingBottom={2}>
                <Paper elevation={10}>
                  <AhGraph data={dayDaywiseData.content || []} />
                </Paper>
              </Box>
              <Paper elevation={10}>
                <ChargingGraph data={dayDaywiseData.content || []} />
              </Paper>
            </div>

            <Box padding="0px 10px 0px 10px">
              <TableContainer
                component={Paper}
                sx={{
                  marginTop: 1,
                  height: "400px",
                  overflow: "auto",
                  border: "1px solid black",
                  borderRadius: "8px",
                }}
              >
                <Table stickyHeader aria-label="daywise table">
                  <TableHead>
                    <TableRow>
                      {Object.keys(columnMappings).map((key) => (
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
                    {formattedData.map((row, index) => (
                      <TableRow
                        key={index}
                        sx={{ "&:hover": { backgroundColor: "#e1e2fe" } }}
                      >
                        {Object.keys(columnMappings).map((key, idx) => (
                          <TableCell
                            key={idx}
                            sx={{
                              border: "1px solid #ccc",
                              padding: "5px",
                              fontWeight: "bold",
                              textAlign: "center"
                            }}
                          >
                            {row[key]}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                rowsPerPageOptions={[5, 10, 20, 30]}
                component="div"
                count={totalRecords || formattedData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Box>
          </>
        ) : (
          <Typography variant="body1" sx={{ marginTop: 2, textAlign: "center" }}>
            No data available
          </Typography>
        )}
      </Box>
    </div>
  );
};

export default DayWise;