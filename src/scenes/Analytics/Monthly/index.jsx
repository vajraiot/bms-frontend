import React, { useContext, useEffect, useState } from "react";
import { useTheme } from "@mui/material";
import { ColorModeContext, tokens } from "../../../theme";
import {
  Box,
  IconButton,
  TextField,
  Autocomplete,
  Paper,
  CircularProgress,
  Tooltip
} from "@mui/material";
import { AppContext } from "../../../services/AppContext";
import { fetchMonthlyBatteryandChargerdetails } from "../../../services/apiService";
import * as XLSX from "xlsx";
import SearchIcon from "@mui/icons-material/Search";
import GridOnIcon from '@mui/icons-material/GridOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
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
  const { data: contextData = [], errors } = useContext(AppContext);
  const data = Array.isArray(contextData) ? contextData : [];
  const [loading, setLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

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
    if (location.pathname === "/monthly") {
      setSiteId("");
      setSerialNumber("");
      setYear("");
      setMonth("");
      setData([]);
    }
  }, [location.pathname]);

  const handleSearch = async () => {
    if (siteId && serialNumber && year && month) {
      setLoading(true);
      try {
        const result = await fetchMonthlyBatteryandChargerdetails(
          serialNumber,
          siteId,
          year,
          month
        );
        setData(Array.isArray(result) ? result : []);
      } catch (error) {
        console.error("Error during search:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    } else {
      console.error("Please select all fields.");
      setData([]);
    }
  };

  const clearOptions = () => {
    setSiteId("");
    setSerialNumber("");
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

  const handleDownloadExcel = async () => {
    if (formattedData.length === 0) {
      return;
    }

    try {
      setIsDownloading(true);
      setDownloadComplete(false);

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
                sx: { fontWeight: "bold" },
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
                sx: { fontWeight: "bold" },
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
            "& .MuiInputLabel-root": { fontWeight: "bold" },
          }}
          InputLabelProps={{ shrink: true }}
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
        <Tooltip title="Export to Excel">
          <Box sx={{ position: 'relative' }}>
            <IconButton
              onClick={handleDownloadExcel}
              disabled={loading || isDownloading || formattedData.length === 0}
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