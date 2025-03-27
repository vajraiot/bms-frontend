import React, { useContext } from "react";
import { useTheme } from "@mui/material";
import { ColorModeContext, tokens } from "../../../theme";
import { Box, IconButton, TextField, Autocomplete, Paper } from "@mui/material";
import { AppContext } from "../../../services/AppContext";
import { fetchMonthlyBatteryandChargerdetails } from "../../../services/apiService";
import * as XLSX from "xlsx";
import SearchIcon from "@mui/icons-material/Search";
import excelIcon from "../../../assets/images/png/ExcellTrans100_98.png";
import MonthlyAHChart from "./MonthlyAHChart";
import MonthlyEnergyChart from "./MonthlyEnergyChart";
import "react-datetime/css/react-datetime.css";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Typography,
} from "@mui/material";

const columnMappings = {
  month: "Month",
  chargeOrDischargeCycle: "Charge/Discharge Cycle",
  cumulativeAHIn: "Cumulative AH In (AH)",
  cumulativeAHOut: "Cumulative AH Out (AH)",
  totalChargingEnergy: "Total Charging Energy (KWH)",
  totalDischargingEnergy: "Total Discharging Energy (KWH)",
  batteryRunHours: "Battery Run Hours",
  sumTotalSoc: "SOC (%)",
  sumCumulativeTotalAvgTemp: "Temperature(°C)",
};

const Monthly = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { data: contextData = [] , errors} = useContext(AppContext); // Default to empty array
  const data = Array.isArray(contextData) ? contextData : []; // Ensure data is always an array
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("month");

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
        setData(Array.isArray(result) ? result : []); // Ensure result is an array
      } catch (error) {
        console.error("Error during search:", error);
        setData([]); // Fallback to empty array on error
      }
    } else {
      console.error("Please select all fields.");
      setData([]); // Fallback to empty array if fields are missing
    }
  };

  const handleRequestSort = (property) => {
    const isAscending = orderBy === property && order === "asc";
    setOrder(isAscending ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatData = (data) => {
    if (!Array.isArray(data) || data.length === 0) return [];

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

    return data.map((row) => {
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
        month,
        batteryRunHours: formatToTime(batteryRunHours || 0),
        chargeOrDischargeCycle,
        cumulativeAHIn: formatToTwoDecimals(cumulativeAHIn),
        cumulativeAHOut: formatToTwoDecimals(cumulativeAHOut),
        totalChargingEnergy: formatToTwoDecimals(totalChargingEnergy),
        totalDischargingEnergy: formatToTwoDecimals(totalDischargingEnergy),
        sumTotalSoc: formatToTwoDecimals(sumTotalSoc),
        sumCumulativeTotalAvgTemp: formatToTwoDecimals(sumCumulativeTotalAvgTemp),
      };
    });
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
    const excelData = displayedData.map((row) =>
      Object.keys(row).map((key) => row[key] ?? "No Data")
    );
    const headers = Object.keys(formattedData[0] || {}).map(
      (key) => columnMappings[key] || key
    );
    excelData.unshift(headers);

    const worksheet = XLSX.utils.aoa_to_sheet(excelData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Monthly Data");
    XLSX.writeFile(workbook, "Monthly_Data.xlsx");
  };

  return (
    <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" p={2} gap={2}>
      {/* Search Inputs */}
      <Box display="grid" gridTemplateColumns="repeat(5, 1fr)" gap={2}>
        <Autocomplete
          options={siteOptions.map((site) => site.siteId)}
          value={siteId}
          onChange={(event, newValue) => setSiteId(newValue)}
          renderInput={(params) => (
            <TextField {...params} label="Substation ID"   InputLabelProps={{
              sx: {
                fontWeight: "bold",
              },
            }}
            fullWidth
            error={errors.siteId}
            helperText={errors.siteId ? "Please enter Site ID" : ""}
            sx={{
              "& .MuiInputBase-root": {
                fontWeight: "bold",
                height: "35px",
                marginTop: "5px",
              },
            }}
          />
        )}
        sx={{ width: "150px" }}
        />
        <Autocomplete
          options={serialNumberOptions}
          value={serialNumber}
          onChange={(event, newValue) => setSerialNumber(newValue)}
          renderInput={(params) => (
            <TextField {...params} label="Serial Number"   InputLabelProps={{
              sx: {
                fontWeight: "bold",
              },
            }}
            fullWidth
            error={errors.serialNumber}
            helperText={errors.serialNumber ? "Please enter Serial Number" : ""}
            sx={{
              "& .MuiInputBase-root": {
                fontWeight: "bold",
                height: "35px",
                marginTop: "5px",
              },
            }}
          />
        )}
        sx={{ width: "150px" }}
      />
        <TextField
          label="Month"
          type="month"
          value={month ? `${year}-${month}` : ""}
          onChange={(e) => {
            const [selectedYear, selectedMonth] = e.target.value.split("-");
            setYear(selectedYear);
            setMonth(selectedMonth);
          }}
          sx={{ width: 200 }}
          InputLabelProps={{ shrink: true }}
        />
        <IconButton onClick={handleSearch}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* Excel Download */}
      <Box display="flex" justifyContent="flex-end" alignItems="center">
        <IconButton onClick={handleDownloadExcel}>
          <img src={excelIcon} alt="Download Excel" style={{ width: "24px", height: "24px" }} />
        </IconButton>
      </Box>

      {/* Charts */}
      <Box gridColumn="span 2" display="flex" flexDirection="row" gap={2}>
        <Box flex={1} height={200}>
          <Paper elevation={8}>
            <MonthlyAHChart data={data} />
          </Paper>
        </Box>
        <Box flex={1}>
          <Paper elevation={8}>
            <MonthlyEnergyChart data={data} />
          </Paper>
        </Box>
      </Box>

      {/* Table */}
      {formattedData.length > 0 ? (
        <Box padding="0px 10px" gridColumn="span 2">
          <TableContainer component={Paper} 
          sx={{
              marginTop: 1,
              overflowX: "auto",
              borderRadius: "8px",
              width: "100%",
              border: "1px solid black",
              
            }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {Object.keys(formattedData[0]).map((key) => (
                    <TableCell key={key}
                     sx={{
                      fontWeight: "bold",
                      background: "linear-gradient(to bottom, #d82b27, #f09819) !important",
                      color: "#ffffff",
                      padding: '3px',
                      minWidth: "150px",
                      whiteSpace: "nowrap",
                      textAlign:"center"
                    }}>
                      <TableSortLabel
                        active={orderBy === key}
                        direction={orderBy === key ? order : "asc"}
                        onClick={() => handleRequestSort(key)}
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
                    <TableRow key={index}>
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
          <TablePagination
            rowsPerPageOptions={[5, 10, 15]}
            count={formattedData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
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