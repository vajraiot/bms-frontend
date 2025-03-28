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
  TableSortLabel,
  Tooltip
} from "@mui/material";
import { AppContext, formatDate } from "../../../services/AppContext";
import ReportsBar from "../ReportsBar/ReportsBar";
import GridOnIcon from '@mui/icons-material/GridOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import * as XLSX from "xlsx";
import { downloadBatteryAlarms } from "../../../services/apiService";

const columnMappings = {
  packetDateTime: "Packet Date Time",
  serverTime: "Server Date Time",
  bankCycle: "Bank Status",
  ambientTemperature: "Ambient Temp",
  soc: "SOC",
  stringVoltage: "String Voltage",
  stringCurrent: "String Current",
  bmsSedCommunication: "BMS SED Comm",
  cellCommunication: "Cell Comm",
  cellVoltageLN: "Cell Voltage LN",
  cellVoltageNH: "Cell Voltage NH",
  cellTemperature: "Cell Temp",
  buzzer: "Buzzer",
  inputMains: "Input Mains",
  inputPhase: "Input Phase",
  inputFuse: "Input Fuse",
  rectifierFuse: "Rectifier Fuse",
  filterFuse: "Filter Fuse",
  dcVoltageOLN: "DC Voltage OLN",
  outputFuse: "Output Fuse",
  acVoltageULN: "AC Voltage LNO",
  chargerLoad: "Charger Load",
  alarmSupplyFuse: "Alarm Supply Fuse",
  chargerTrip: "Charger Trip",
  outputMccb: "Output MCCB",
  batteryCondition: "Battery Condition",
  testPushButton: "Test Push Button",
  resetPushButton: "Reset Push Button",
};

const Alarms = () => {
  const theme = useTheme();
  const { 
    alarmsData = {}, 
    page, 
    setPage, 
    rowsPerPage, 
    setRowsPerPage, 
    totalRecords,
    loadingReport,
    siteId,
    serialNumber,
    startDate,
    endDate
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const dataArray = Array.isArray(alarmsData.content) ? alarmsData.content : [alarmsData];
  const displayedColumns = Object.keys(columnMappings);

  
  const handleDownloadExcel = async () => {

    try {
      setIsDownloading(true);
      setDownloadComplete(false);

    await downloadBatteryAlarms(siteId,serialNumber,formatDate(startDate),formatDate(endDate));

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
        <ReportsBar pageType="alarms" />
        <Tooltip title="Export to Excel">
          <Box sx={{ position: 'relative', marginRight: '20px' }}>
            <IconButton
              onClick={handleDownloadExcel}
              disabled={loadingReport || isDownloading || !siteId || !startDate || !endDate }
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
          <Typography variant="body1">Loading alarms data...</Typography>
        </Box>
      ) : dataArray.length > 0 && Object.keys(alarmsData).length > 0 ? (
        <Box padding="0px 10px 0px 10px">
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
            <Table stickyHeader aria-label="alarms table">
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
                          : key === "dcVoltageOLN"
                          ? row[key] === "Normal" ? "Normal" : 
                            row[key] === "Low" ? "Low" : 
                            row[key] === "Over" ? "Over" : row[key]
                          : row[key] === "Fail" ? "Fail" :
                            row[key] === "Normal" ? "Normal" :
                            row[key] || "N/A"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[100, 200, 500, 1000, 1500, 2000]}
            component="div"
            count={totalRecords || dataArray.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      ) : (
        <Typography variant="body1" sx={{ marginTop: 2, textAlign: "center" }}>
          No data available
        </Typography>
      )}
    </div>
  );
};

export default Alarms;