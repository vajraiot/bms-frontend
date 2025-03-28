import React, { useContext, useEffect, useState } from "react"; // Added useState
import { useTheme } from "@mui/material";
import { ColorModeContext, tokens } from "../../../theme";
import {
  Box,
  IconButton,
  TextField,
  Autocomplete,
  Paper,
  CircularProgress, // Added CircularProgress
} from "@mui/material";
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
  const { data: contextData = [], errors } = useContext(AppContext); // Default to empty array
  const data = Array.isArray(contextData) ? contextData : []; // Ensure data is always an array
  const [loading, setLoading] = useState(false); // Added loading state

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

  useEffect(() => {
    if (location.pathname === "/monthly") { // Adjust path based on your route
      setSiteId(""); // Clear Site ID
      setSerialNumber(""); // Clear Serial Number
      setYear(""); // Clear Year
      setMonth(""); // Clear Month
      setData([]); // Clear data/content
    }
  }, [location.pathname]);

  const handleSearch = async () => {
    if (siteId && serialNumber && year && month) {
      setLoading(true); // Set loading to true before fetching
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
      } finally {
        setLoading(false); // Set loading to false after fetching (success or error)
      }
    } else {
      console.error("Please select all fields.");
      setData([]); // Fallback to empty array if fields are missing
    }
  };

  const clearOptions = () => {
    setSiteId(""); // Reset Site ID
    setSerialNumber(""); // Reset Serial Number
    setYear("");
    setMonth("");
    setData([]);
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

  const formattedData = formatData(data);

  const handleDownloadExcel = () => {
    const workbook = XLSX.utils.book_new();
    const excelData = formattedData.map((row) =>
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
          freeSolo
          options={siteOptions.map((site) => site.siteId)}
          value={siteId}
          onChange={(event, newValue) => setSiteId(newValue)}
          filterOptions={(options, { inputValue }) => {
            if (!inputValue) return [];
            const lowerInput = inputValue.toLowerCase();
            return options.filter((option) =>
              option.toLowerCase().startsWith(lowerInput)
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Substation ID"
              InputLabelProps={{
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
            <TextField
              {...params}
              label="Serial Number"
              InputLabelProps={{
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
        <IconButton onClick={handleSearch} disabled={!siteId || !serialNumber || !year || !month || loading}>
          <SearchIcon />
        </IconButton>
        <Box onClick={clearOptions} sx={{ cursor: "pointer" }}>
          <Typography variant="body1" sx={{ fontSize: 15, marginTop: 1 }}>
            ❌
          </Typography>
        </Box>
      </Box>

      {/* Excel Download */}
      <Box display="flex" justifyContent="flex-end" alignItems="center">
        <IconButton onClick={handleDownloadExcel} disabled={loading}>
          <img src={excelIcon} alt="Download Excel" style={{ width: "24px", height: "24px" }} />
        </IconButton>
      </Box>

      {/* Loading Indicator or Content */}
      {loading ? (
        <Box gridColumn="span 2" display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      ) : (
        <>
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
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      {Object.keys(formattedData[0]).map((key) => (
                        <TableCell
                          key={key}
                          sx={{
                            fontWeight: "bold",
                            background: "linear-gradient(to bottom, #d82b27, #f09819) !important",
                            color: "#ffffff",
                            padding: "3px",
                            minWidth: "150px",
                            whiteSpace: "nowrap",
                            textAlign: "center",
                          }}
                        >
                          {columnMappings[key] || key}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formattedData.map((row, index) => (
                      <TableRow key={index}>
                        {Object.values(row).map((value, idx) => (
                          <TableCell
                            key={idx}
                            sx={{
                              border: "1px solid #ccc",
                              padding: "5px",
                              fontWeight: "bold",
                              textAlign: "center",
                            }}
                          >
                            {value}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ) : (
            <Typography variant="body1" sx={{ marginTop: 2, gridColumn: "span 2" }}>
              No data available
            </Typography>
          )}
        </>
      )}
    </Box>
  );
};

export default Monthly;