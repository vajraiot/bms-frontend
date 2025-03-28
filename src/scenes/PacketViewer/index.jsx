import { useState, useEffect } from "react";
import axios from "axios";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Pagination,
  Box,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";

function PacketViwer() {
  const [rawData, setRawData] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const BASE_URL = "http://122.175.45.16:51270";

  const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  // Add JWT token to every request via interceptor
  apiClient.interceptors.request.use(
    (config) => {
      const token = sessionStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  // Fetch paginated raw data
  const fetchData = async (page) => {
    setLoading(true);
    try {
      const response = await apiClient.get(
        `${BASE_URL}/packetViewer/rawdata?page=${page}&size=10`
      );
      setRawData(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data by date
  const fetchDataByDate = async (page, date) => {
    setLoading(true);
    try {
      setRawData([]);
      setTotalPages(0);
      const response = await apiClient.get(
        `${BASE_URL}/packetViewer/date?date=${date.toISOString().split("T")[0]}&page=${page}&size=10`
      );
      setRawData(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch detailed data by ID
  const fetchDetailedData = async (id) => {
    setLoading(true);
    try {
      const response = await apiClient.get(
        `${BASE_URL}/packetViewer/parsedData?id=${id}`
      );
      setSelectedData(response.data);
    } catch (error) {
      console.error("Error fetching detailed data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle date change
  const handleDateChange = (newDate) => {
    setStartDate(newDate);
    setPage(0);
    if (newDate) {
      fetchDataByDate(0, newDate);
    } else {
      fetchData(0);
    }
  };

  // Fetch data when page changes
  useEffect(() => {
    if (startDate) {
      fetchDataByDate(page, startDate);
    } else {
      fetchData(page);
    }
  }, [page]);

  // Handle pagination page change
  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);
  };

  // Handle row click
  const handleRowClick = (id) => {
    fetchDetailedData(id);
  };

  // Render key-value pairs
  const renderKeyValuePairs = (obj, title) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
        {title}
      </Typography>
      {Object.entries(obj).map(([key, value]) => (
        <Box
          key={key}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            p: 1,
            bgcolor: "#f5f5f5",
            borderRadius: 1,
            mb: 0.5,
          }}
        >
          <Typography sx={{ fontWeight: "medium" }}>
            {key.replace(/([A-Z])/g, " $1").trim()}:
          </Typography>
          <Typography sx={{ color: "#555", wordBreak: "break-word", maxWidth: "60%" }}>
          {typeof value === "boolean"
            ? value
              ? "Failure"
              : "Normal"
            : typeof value === "object" && value !== null
            ? JSON.stringify(value)
            : String(value)}
        </Typography>
        </Box>
      ))}
    </Box>
  );

  // Render detailed data sections
  const renderDetailedData = () => {
    if (!selectedData) return null;

    const { bmsalarms, chargerStatusData, cellVoltageTemperatureData, ...otherData } = {
      ...selectedData,
      ...selectedData.deviceData[0],
      ...selectedData.chargerMonitoringData[0],
    };

    const alarmsData = { "BMS Alarms": bmsalarms, "Charger Status": chargerStatusData };
    const cellsData = cellVoltageTemperatureData || [];
    const filteredOtherData = { ...otherData };
    delete filteredOtherData.deviceData;
    delete filteredOtherData.chargerMonitoringData;

    return (
      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          maxHeight: "72vh",
          overflowY: "auto",
          p: 2,
          bgcolor: "#fff",
          borderRadius: 2,
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        {/* Alarms Section */}
        <Box sx={{ flex: 1, minWidth: "300px" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, color: "#3f51b5" }}>
            Alarms
          </Typography>
          {Object.entries(alarmsData).map(([title, data]) =>
            renderKeyValuePairs(data, title)
          )}
        </Box>

        {/* Cells Data Section */}
        <Box sx={{ flex: 1, minWidth: "300px" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, color: "#3f51b5" }}>
            Cells Data
          </Typography>
          {cellsData.length > 0 ? (
            cellsData.map((cell, index) => renderKeyValuePairs(cell, `Cell ${index + 1}`))
          ) : (
            <Typography>No cell data available</Typography>
          )}
        </Box>

        {/* Other Data Section */}
        <Box sx={{ flex: 1, minWidth: "300px" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, color: "#3f51b5" }}>
            Other Data
          </Typography>
          {renderKeyValuePairs(filteredOtherData, "General Info")}
        </Box>
      </Box>
    );
  };

  return (
    <Grid container spacing={0} sx={{overflow: "hidden"}}>    
      {/* Main content */}
      <Grid item xs={12} md={5}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 2,
            maxWidth: "1000px",
            margin: "0 auto",
            gap: 1,
          }}
        >
          {/* Date Picker */}
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Select Date"
              value={startDate}
              onChange={handleDateChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  sx={{
                    width: 100,
                    "& .MuiInputBase-root": {
                      fontWeight: "bold",
                      height: "25px",
                      marginTop: 1,
                    },
                    "& .MuiInputLabel-root": {
                      fontWeight: "bold",
                    },
                  }}
                />
              )}
            />
          </LocalizationProvider>

          {loading ? (
            <CircularProgress sx={{ mt: 2 }} />
          ) : (
            <>
              <TableContainer
                component={Paper}
                sx={{
                  pt: 2,
                  borderRadius: "8px 8px 0 0",
                  flex: 1,
                  overflowY: "auto",
                  maxHeight: "60vh",
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>General Id</TableCell>
                      <TableCell>Raw Data</TableCell>
                      <TableCell>Substation ID</TableCell>
                      <TableCell>Date Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rawData.map((data, index) => (
                      <TableRow
                        key={index}
                        onClick={() => handleRowClick(data.generalDataId)}
                        sx={{ 
                            border: '1px solid #ccc',
                            padding: '3px',
                            fontWeight: 'bold',
                            whiteSpace: "nowrap",
                            textAlign:"center"
                          }}
                      >
                        <TableCell>{data.generalDataId}</TableCell>
                        <TableCell
                          sx={{
                            maxWidth: "30px",
                            whiteSpace: "normal",
                            overflow: "auto",
                          }}
                        >
                          {data.rawData}
                        </TableCell>
                        <TableCell>{data.siteId}</TableCell>
                        <TableCell>
                          {new Date(data.serverDateTime).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Pagination
                  count={totalPages}
                  page={page + 1}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            </>
          )}
        </Box>
      </Grid>

      {/* Sidebar with Packet Viewer */}
      <Grid item xs={12} md={7}>
        <Box
          sx={{
            background: "linear-gradient(to bottom, #d82b27, #f09819) !important",
            color: "white",
            padding: 1,
            textAlign: "center",
            width: "100%",
          }}
        >
          <Typography variant="h4">Packet Viewer</Typography>
        </Box>
        <Box
          sx={{
            bgcolor: "#fafafa",
            borderLeft: "1px solid #ddd",
            minHeight: "74vh", // Match table height for consistency
          }}
        >
          {selectedData ? (
            renderDetailedData()
          ) : (
            <Typography>Select a row to view detailed data</Typography>
          )}
        </Box>
      </Grid>
    </Grid>
  );
}

export default  PacketViwer;