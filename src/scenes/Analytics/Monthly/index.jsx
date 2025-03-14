import React, { useContext } from "react";
import { useTheme } from "@mui/material";
import { ColorModeContext, tokens } from "../../../theme";
import { Box, IconButton, TextField, Autocomplete, useTheme ,Paper} from "@mui/material";
import { AppContext } from "../../../services/AppContext";
import { fetchMonthlyBatteryandChargerdetails } from "../../../services/apiService";
import * as XLSX from "xlsx";
import SearchIcon from "@mui/icons-material/Search";
import excelIcon from "../../../assets/images/png/ExcellTrans100_98.png";
import MonthlyAHChart from './MonthlyAHChart';
import MonthlyEnergyChart from './MonthlyEnergyChart' // Ensure this is imported

import 'react-datetime/css/react-datetime.css';
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

const columnMappings = {
  month: "Month",
  chargeOrDischargeCycle: "Charge/Discharge Cycle",
  cumulativeAHIn: "Cumulative AH In",
  cumulativeAHOut: "Cumulative AH Out",
  totalChargingEnergy: "Total Charging Energy",
  totalDischargingEnergy: "Total Discharging Energy",
  batteryRunHours: "Battery Run Hours",
  sumTotalSoc:"SOC",
  sumCumulativeTotalAvgTemp:"Temperature"
};

const Monthly = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const { data = [] } = useContext(AppContext);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("dayWiseDate");

  const {
    siteOptions,
    serialNumberOptions,
    siteId,
    serialNumber,
    year,
    month,
    setSiteId,
    setSerialNumber,
    setYear,
    setMonth,
    setData,
  } = useContext(AppContext);

  const handleSearch = async () => {
    if (siteId && serialNumber && year && month) {
      try {
        const result = await fetchMonthlyBatteryandChargerdetails(
          serialNumber,
          siteId,
          year,
          month
        );
        setData(result);
      } catch (error) {
        console.error("Error during search:", error);
      }
    } else {
      console.error("Please select all fields.");
    }
  };

  const handleRequestSort = (property) => {
    const isAscending = orderBy === property && order === "asc";
    setOrder(isAscending ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate("/");
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatData = (data) => {
    if (!data || data.length === 0) return [];

    const formatToTime = (seconds) => {
      const hrs = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${hrs.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const formatToTwoDecimals = (value) =>
      value !== null && value !== undefined
        ? parseFloat(value).toFixed(2)
        : "-";

    const formattedData = data.map((row) => {
      const {
        month,
        batteryRunHours,
        chargeOrDischargeCycle,
        cumulativeAHIn,
        cumulativeAHOut,
        totalChargingEnergy,
        totalDischargingEnergy,
        sumTotalSoc,
        sumCumulativeTotalAvgTemp,
      } = row;

      return {
        month: month,
        batteryRunHours: formatToTime(batteryRunHours || 0),
        chargeOrDischargeCycle: chargeOrDischargeCycle,
        cumulativeAHIn: formatToTwoDecimals(cumulativeAHIn),
        cumulativeAHOut: formatToTwoDecimals(cumulativeAHOut),
        totalChargingEnergy: formatToTwoDecimals(totalChargingEnergy),
        totalDischargingEnergy: formatToTwoDecimals(totalDischargingEnergy),
        sumTotalSoc:sumTotalSoc,
        sumCumulativeTotalAvgTemp:formatToTwoDecimals(sumCumulativeTotalAvgTemp),
      };
    });

    return formattedData;
  };

  const sortedData = (data) => {
    return [...data].sort((a, b) => {
      if (order === "asc") {
        return a[orderBy] > b[orderBy] ? 1 : -1;
      }
      return a[orderBy] < b[orderBy] ? 1 : -1;
    });
  };

  const formattedData = formatData(data);
  const displayedData = sortedData(formattedData);

  const handleDownloadExcel = () => {
    const workbook = XLSX.utils.book_new();
    const excelData = displayedData.map((row) => {
      return Object.keys(row).map((key) => {
        if (key === "packetDateTime" || key === "serverTime") {
          return TimeFormat(row[key]);
        } else if (key === "dcVoltageOLN") {
          return row[key] === 0 ? "Low" : row[key] === 1 ? "Normal" : row[key] === 2 ? "Over" : row[key];
        } else if (typeof row[key] === "boolean") {
          return row[key] ? "Fail" : "Normal";
        } else {
          return row[key] !== undefined && row[key] !== null ? row[key] : "No Data";
        }
      });
    });

    const headers = Object.keys(formattedData[0]).map((key) => columnMappings[key] || key);
    excelData.unshift(headers);

    const worksheet = XLSX.utils.aoa_to_sheet(excelData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Historical Data");
    XLSX.writeFile(workbook, "Monthly_Data.xlsx");
  };
  const sampleData = [
    { month: "2025-02", cumulativeAHIn: 10.08, cumulativeAHOut: 0.0 },
    { month: "2025-03", cumulativeAHIn: 15.23, cumulativeAHOut: 5.67 },
  ];
  return (
    <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" p={2} gap={2}>
      {/* Grid 1: Site ID, Serial Number, Year and Month, Search */}
      <Box display="grid" gridTemplateColumns="repeat(5, 1fr)" gap={2}>
        <Autocomplete
          disablePortal
          disableClearable
          options={siteOptions.map((site) => site.siteId)}
          value={siteId}
          onChange={(event, newValue) => setSiteId(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Site ID"
              fullWidth
              sx={{
                width: 200,
                "& .MuiInputBase-root": {
                  fontWeight: "bold",
                  height: "35px",
                  marginTop: "5px",
                },
                "& .MuiInputLabel-root": {
                  fontWeight: "bold",
                },
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}
          sx={{ width: 200 }}
        />

        <Autocomplete
          disablePortal
          disableClearable
          options={serialNumberOptions}
          value={serialNumber}
          onChange={(event, newValue) => setSerialNumber(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Serial Number"
              fullWidth
              sx={{
                width: 200,
                "& .MuiInputBase-root": {
                  fontWeight: "bold",
                  height: "35px",
                  marginTop: "5px",
                },
                "& .MuiInputLabel-root": {
                  fontWeight: "bold",
                },
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}
          sx={{ width: 200 }}
        />

        <TextField
          label="Month"
          type="month"
          value={month ? `${year}-${month}` : ""}
          onChange={(e) => {
            const selectedDate = e.target.value;
            const selectedMonth = selectedDate.split("-")[1];
            setMonth(selectedMonth);
            setYear(selectedDate.split("-")[0]);
          }}
          fullWidth
          sx={{
            width: 200,
            "& .MuiInputBase-root": {
              fontWeight: "bold",
              height: "35px",
              marginTop: "5px",
            },
            "& .MuiInputLabel-root": {
              fontWeight: "bold",
            },
          }}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <IconButton onClick={handleSearch}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* Grid 2: Color Mode Toggle, Notification Icon, Logout Icon */}
      <Box display="flex" justifyContent="flex-end" alignItems="center" marginLeft="10px">
        <IconButton onClick={handleDownloadExcel} color="primary" aria-label="Download Excel">
          <img src={excelIcon} alt="Download Excel" style={{ width: "24px", height: "24px" }} />
        </IconButton>
      </Box>

      {/* Bar Chart */}
      <Box gridColumn="span 2" display="flex" flexDirection="row" gap={2} marginBottom={2}  >
          <Box flex={1} height={200}>
            <Paper elevation={8} >
              <MonthlyAHChart data={data} />
            </Paper>
          </Box>
          <Box flex={1}>
            <Paper elevation={8} >
              <MonthlyEnergyChart data={data} />
            </Paper>
           </Box>
      </Box>

      {/* Table */}
      {formattedData && formattedData.length > 0 ? (
        <Box padding="0px 10px 0px 10px" gridColumn="span 2">
          <TableContainer
            component={Paper}
            sx={{
              marginTop: 1,
              overflowX: "auto",
              borderRadius: "8px",
              width: "100%",
              border: "1px solid black",
              
            }}
          >
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {Object.keys(formattedData[0]).map((key) => (
                    <TableCell
                      key={key}
                      sx={{
                        fontWeight: "bold",
                        background: "linear-gradient(to bottom, #d82b27, #f09819) !important",
                        color: "#ffffff",
                        padding: '3px',
                        minWidth: "150px",
                        whiteSpace: "nowrap",
                        textAlign:"center"
                      }}
                    >
                      <TableSortLabel
                        active={orderBy === key}
                        direction={orderBy === key ? order : "asc"}
                        onClick={() => handleRequestSort(key)}
                        aria-label={`Sort by ${columnMappings[key] || key}`}
                      >
                        {columnMappings[key] || key}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {displayedData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:hover": { backgroundColor: "#e1e2fe" },
                      }}
                    >
                      {Object.values(row).map((value, idx) => (
                        <TableCell key={idx} sx={{ 
                          border: '1px solid #ccc',
                          padding: '5px',
                          fontWeight: 'bold',
                          textAlign:"center"
                        }}>{value}</TableCell>
                      ))}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 15]}
              component="div"
              count={formattedData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        </Box>
      ) : (
        <Typography variant="body1" sx={{ marginTop: 2 }}>
          No data available
        </Typography>
      )}
    </Box>
  );
};

export default Monthly;