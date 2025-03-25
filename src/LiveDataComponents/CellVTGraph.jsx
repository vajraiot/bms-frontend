import React, { useState, useEffect } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import DatePicker from "react-datepicker";
import axios from "axios";
//import "react-datepicker/dist/react-datepicker.css";
import { Dialog, DialogContent } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Box, Paper, Typography, Stack, IconButton,useTheme } from "@mui/material";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloseIcon from "@mui/icons-material/Close";
import {downloadCellVTDetails} from "../services/apiService"
// import "./CellVTGraph.css";
const BASE_URL = "http://localhost:51270";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add JWT token to every request via interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
import { tokens } from '../theme';
const CellVTGraph = ({ site, serial, cellNumber, open, onClose }) => {
  const theme = useTheme();
  const [startDate, setStartDate] = useState(new Date());
  const [chartType, setChartType] = useState("line");
  const [cellData, setCellData] = useState([]);
  const [voltageChartOptions, setVoltageChartOptions] = useState({
    chart: {
      height: 300,
      width: 900,
    },
    title: { text: "Voltage-Time Graph" },
    xAxis: { type: "datetime" },
    yAxis: { title: { text: "Voltage (V)" } },
    series: [],
    accessibility: { enabled: false }, // Suppress accessibility warning
  });
  const [sgChartOptions, setSgChartOptions] = useState({
    chart: {
      height: 300,
      width: 900,
    },
    title: { text: "Specific Gravity-Time Graph" },
    xAxis: { type: "datetime" },
    yAxis: { title: { text: "Specific Gravity" } },
    series: [],
    accessibility: { enabled: false }, // Suppress accessibility warning
  });
  const [temperatureChartOptions, setTemperatureChartOptions] = useState({
    chart: {
      height: 300,
      width: 900,
    },
    title: { text: "Temperature-Time Graph" },
    xAxis: { type: "datetime" },
    yAxis: { title: { text: "Temperature (°C)" } },
    series: [],
    accessibility: { enabled: false }, // Suppress accessibility warning
  });

  const [cellInfo, setCellInfo] = useState({
    siteId: site,
    serialNumber: serial,
    cellNumber: cellNumber,
  });

  useEffect(() => {
    if (open) {
      const formattedDate = startDate.toISOString().slice(0, 10);
      fetchCellData(formattedDate);
    }
  }, [startDate, open]);

  const fetchCellData = (date) => {
    if (typeof date === "string") {
      date = new Date(date);
    }
    if (!(date instanceof Date) || isNaN(date)) {
      console.error("Invalid date:", date);
      return;
    }

    const formattedDate = date.toISOString().slice(0, 10);
    const startDateTime = `${formattedDate} 00:00:00`;
    const endDateTime = `${formattedDate} 23:59:59`;

    const apiUrl = `${BASE_URL}/getSpecificCellDataBySiteIdAndSerialNumberBetweenDates?siteId=${cellInfo.siteId}&serialNumber=${cellInfo.serialNumber}&cellNumber=${cellInfo.cellNumber}&strStartDate=${encodeURIComponent(
      startDateTime
    )}&strEndDate=${encodeURIComponent(endDateTime)}`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("API Data:", data); // Debug: Log API data
        setCellData(data);
        generateCharts(
          data.filter(
            (cell) =>
              cell.cellVoltage !== 65.535 && cell.cellTemperature !== 65535
          )
        );
      })
      .catch((error) => {
        console.error("Error fetching cell data:", error);
      });
  };

  const manipulateDateTime = (dateString) => {
    if (dateString == null || dateString === "") {
      return "";
    }
    const utcDate = new Date(dateString);
    if (isNaN(utcDate)) {
      console.error("Invalid date string:", dateString);
      return "";
    }
  
    // Adjust to local timezone (e.g., IST) and set minutes to 59
    const localDate = new Date(utcDate.getTime() + (5.5 * 60 * 60 * 1000)); // UTC+05:30
    localDate.setMinutes(59); // Force minutes to 59
    localDate.setSeconds(0);  // Optional: Reset seconds to 0
    const timestamp = localDate.getTime();
  
    console.log("Original:", dateString, "Adjusted Timestamp:", timestamp);
    return timestamp;
  };

  const generateCharts = (data) => {
    const voltageData = data.map((item) => ({
      x: manipulateDateTime(item.packetDateTime), // Use manipulated timestamp
      y: item.cellVoltage,
    }));

    const temperatureData = data.map((item) => ({
      x: manipulateDateTime(item.packetDateTime), // Use manipulated timestamp
      y: item.cellTemperature,
    }));

    const sgData = data.map((item) => ({
      x: manipulateDateTime(item.packetDateTime), // Use manipulated timestamp
      y: item.cellSpecificgravity,
    }));

    const xAxisConfig = {
      type: "datetime",
      labels: {
        format: "{value:%d-%m-%Y %H:%M:%S}", // Format for DD-MM-YYYY HH:MM:SS
        rotation: -45,
      },
      tickPixelInterval: 50,
      tickInterval: 1 * 60 * 1000, // 1-minute interval
    };

    setVoltageChartOptions({
      chart: { type: "line", height: 250, width: 750 },
      title: { text: "Voltage-Time Graph" },
      xAxis: xAxisConfig,
      yAxis: { title: { text: "Voltage (V)" } },
      series: [{ name: "Voltage", data: voltageData, type: chartType }],
      responsive: {
        rules: [
          {
            condition: { maxWidth: 600 },
            chartOptions: { legend: { enabled: false } },
          },
        ],
      },
      credits: { enabled: false },
      accessibility: { enabled: false }, // Suppress accessibility warning
    });
    setSgChartOptions({
      chart: { type: "line", height: 250, width: 750 },
      title: { text: "Specific Gravity-Time Graph" },
      xAxis: xAxisConfig,
      yAxis: { title: { text: "Specific Gravity" } },
      series: [{ name: "Specific Gravity", data: sgData, type: chartType }],
      responsive: {
        rules: [
          {
            condition: { maxWidth: 600 },
            chartOptions: { legend: { enabled: false } },
          },
        ],
      },
      credits: { enabled: false },
      accessibility: { enabled: false }, // Suppress accessibility warning
    });
    setTemperatureChartOptions({
      chart: { type: "line", height: 250, width: 750 },
      title: { text: "Temperature-Time Graph" },
      xAxis: xAxisConfig,
      yAxis: { title: { text: "Temperature (°C)" } },
      series: [{ name: "Temperature", data: temperatureData, type: chartType }],
      responsive: {
        rules: [
          {
            condition: { maxWidth: 600 },
            chartOptions: { legend: { enabled: false } },
          },
        ],
      },
      credits: { enabled: false },
      accessibility: { enabled: false }, // Suppress accessibility warning
    });
  };

  const downloadExcel = () => {
    const startDateTime = `${startDate.toISOString().slice(0, 10)} 00:00:00`;
    const endDateTime = `${startDate.toISOString().slice(0, 10)} 23:59:59`;
    downloadCellVTDetails(cellInfo.siteId,cellInfo.serialNumber,cellInfo.cellNumber,startDateTime,endDateTime)
  };
  

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          width: "90%",
          height: "90%",
          maxHeight: "90vh",
          backgroundColor: "white",
          borderRadius: "10px",
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Box
          sx={{
            p: "13px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          {/* Date Picker, Cell Number, Download, and Close Button Row */}
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{
              mb: 2,
              width: "100%",
              justifyContent: "space-between",
              px: 2,
            }}
          >
            {/* Start Date Picker */}
            <Box sx={{ flex: 1 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(date) => setStartDate(date)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{
                        width: 200,
                        "& .MuiInputBase-root": { height: "40px" },
                        input: { color: "black" },
                        label: { color: "black" },
                        svg: { color: "black" },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Box>

            {/* Cell Number Text */}
            <Box sx={{ flex: 1, textAlign: "center" }}>
              <Typography variant="h6" sx={{ color: "black" }}>
                {`Cell Number: ${cellInfo.cellNumber}`}
              </Typography>
            </Box>

            {/* Download and Close Buttons */}
            <Box sx={{ flex: 1, textAlign: "right" }}>
              <IconButton
                onClick={downloadExcel}
                aria-label="Download Excel"
                sx={{ padding: 1, color: "black" }}
              >
                <FileDownloadIcon fontSize="large" />
              </IconButton>
              <IconButton
                onClick={onClose}
                aria-label="Close"
                sx={{ padding: 1, color: "red" }}
              >
                <CloseIcon fontSize="large" />
              </IconButton>
            </Box>
          </Stack>

          {/* Charts Container */}
          <Paper
            sx={{
              width: "100%",
              height: "calc(100% - 80px)", // Adjust height to fit within dialog
              borderRadius: "10px",
              border: "1px solid #444",
              overflowY: "auto",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                padding: 3,
              }}
            >
              {/* Voltage Chart */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <HighchartsReact
                  highcharts={Highcharts}
                  options={voltageChartOptions}
                />
              </Box>

              {/* Temperature Chart */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <HighchartsReact
                  highcharts={Highcharts}
                  options={temperatureChartOptions}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <HighchartsReact
                  highcharts={Highcharts}
                  options={sgChartOptions}
                />
              </Box>
            </Box>
          </Paper>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CellVTGraph;

// import React, { useState, useEffect } from "react";
// import { Box, Stack, Paper, Typography, TextField, IconButton } from "@mui/material";
// import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import FileDownloadIcon from "@mui/icons-material/FileDownload";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// const CellVTGraph = ({ site, serial, cellNumber }) => {
//   const [startDate, setStartDate] = useState(new Date());
//   const [cellData, setCellData] = useState([]);
//   const [cellInfo, setCellInfo] = useState({
//     siteId: site,
//     serialNumber: serial,
//     cellNumber: cellNumber,
//   });

//   // Fetch cell data on start date change
//   useEffect(() => {
//     const formattedDate = startDate.toISOString().slice(0, 10);
//     fetchCellData(formattedDate);
//   }, [startDate]);

//   const fetchCellData = (date) => {
//     if (typeof date === "string") {
//       date = new Date(date);
//     }

//     if (!(date instanceof Date) || isNaN(date)) {
//       console.error("Invalid date:", date);
//       return;
//     }

//     const formattedDate = date.toISOString().slice(0, 10);
//     const startDateTime = `${formattedDate} 00:00:00`;
//     const endDateTime = `${formattedDate} 23:59:59`;

//     const apiUrl = `http://122.175.45.16:51270/getSpecificCellDataBySiteIdAndSerialNumberBetweenDates?siteId=${cellInfo.siteId}&serialNumber=${cellInfo.serialNumber}&cellNumber=${cellInfo.cellNumber}&strStartDate=${encodeURIComponent(
//       startDateTime
//     )}&strEndDate=${encodeURIComponent(endDateTime)}`;

//     fetch(apiUrl)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         return response.json();
//       })
//       .then((data) => {
//         setCellData(data.filter((cell) => cell.cellVoltage !== 65.535 && cell.cellTemperature !== 65535));
//       })
//       .catch((error) => {
//         console.error("Error fetching cell data:", error);
//       });
//   };

//   // Format data for Recharts
//   const formatChartData = (data) => {
//     return data.map((item) => ({
//       datetime: new Date(item.packetDateTime).toLocaleString(),
//       voltage: item.cellVoltage,
//       temperature: item.cellTemperature,
//     }));
//   };

//   // Download cell data as Excel
//   const downloadExcel = () => {
//     const startDateTime = `${startDate.toISOString().slice(0, 10)} 00:00:00`;
//     const endDateTime = `${startDate.toISOString().slice(0, 10)} 23:59:59`;

//     const url = `http://122.175.45.16:51470/downloadCellDataReport?siteId=${cellInfo.siteId}&serialNumber=${cellInfo.serialNumber}&cellNumber=${cellInfo.cellNumber}&strStartDate=${startDateTime}&strEndDate=${endDateTime}`;

//     const anchor = document.createElement("a");
//     anchor.href = url;
//     anchor.download = `CellData_${cellInfo.cellNumber}_${startDate.toISOString().slice(0, 10)}.xlsx`;
//     document.body.appendChild(anchor);
//     anchor.click();
//     document.body.removeChild(anchor);
//   };

//   return (
//     <Box
//       sx={{
//         p: "13px",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         width: "70%",
//         maxWidth: "1200px",
//         backgroundColor: "white",
//         borderRadius: "10px",
//       }}
//     >
//       {/* Date Picker and Download Button Row */}
//       <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2, width: "100%", justifyContent: "space-between" }}>
//         {/* Start Date Picker */}
//         <Box sx={{ flex: 1 }}>
//           <LocalizationProvider dateAdapter={AdapterDateFns}>
//             <DatePicker
//               label="Start Date"
//               value={startDate}
//               onChange={(date) => setStartDate(date)}
//               renderInput={(params) => <TextField {...params} sx={{ width: 200 }} />}
//             />
//           </LocalizationProvider>
//         </Box>

//         {/* Cell Number Text */}
//         <Box sx={{ flex: 1, textAlign: "center" }}>
//           <Typography variant="h6" sx={{ color: "black" }}>
//             {`Cell Number: ${cellInfo.cellNumber}`}
//           </Typography>
//         </Box>

//         {/* Download Button */}
//         <Box sx={{ flex: 1, textAlign: "right", paddingRight: 10 }}>
//           <IconButton onClick={downloadExcel} aria-label="Download Excel" sx={{ padding: 1, color: "black" }}>
//             <FileDownloadIcon fontSize="large" />
//           </IconButton>
//         </Box>
//       </Stack>

//       {/* Card Container for Charts */}
//       <Paper sx={{ width: "100%", height: "500px", borderRadius: "10px", border: "1px solid #444", overflowY: "auto" }}>
//         <Box sx={{ display: "flex", flexDirection: "column", gap: 4, padding: 3 }}>
//           {/* Voltage Chart */}
//           <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={formatChartData(cellData)}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis
//                 dataKey="datetime"
//                 angle={-45} // Rotate labels by -45 degrees
//                 dy={10} // Adjust vertical position of labels
//                 tick={{ fontSize: 10 }} // Adjust font size if needed
//                 />
//                 <YAxis label={{ value: "Voltage (V)", angle: -90, position: "insideLeft" }} />
//                 <Tooltip />
//                 <Legend />
//                 <Line type="monotone" dataKey="voltage" stroke="#8884d8" />
//               </LineChart>
//             </ResponsiveContainer>
//           </Box>

//           {/* Temperature Chart */}
//           <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={formatChartData(cellData)}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis
//                   dataKey="datetime"
//                   angle={-45} // Rotate labels by -45 degrees
//                   dy={10} // Adjust vertical position of labels
//                   tick={{ fontSize: 10 }} // Adjust font size if needed
//                 />
//                 <YAxis label={{ value: "Temperature (°C)", angle: -90, position: "insideLeft" }} />
//                 <Tooltip />
//                 <Legend />
//                 <Line type="monotone" dataKey="temperature" stroke="#82ca9d" />
//               </LineChart>
//             </ResponsiveContainer>
//           </Box>
//         </Box>
//       </Paper>
//     </Box>
//   );
// };

// export default CellVTGraph;