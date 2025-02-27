import React, { useState, useEffect } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import DatePicker from "react-datepicker";
//import "react-datepicker/dist/react-datepicker.css";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Box, Paper, Typography, Stack, IconButton,useTheme } from "@mui/material";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
// import "./CellVTGraph.css";
import { tokens } from '../theme';
const CellVTGraph = (site,serial,cellNumber) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [startDate, setStartDate] = useState(new Date());
  const [chartType, setChartType] = useState("line");
  const [cellData, setCellData] = useState([]);
  const [voltageChartOptions, setVoltageChartOptions] = useState({
        chart: {
    height: 300, // Set the height of the chart
    width: 900,  // Set the width of the chart
  },
  title: { text: "Voltage-Time Graph" },
  xAxis: { type: "datetime" },
  yAxis: { title: { text: "Voltage (V)" } },
  series: []
  });
  const [temperatureChartOptions, setTemperatureChartOptions] = useState({
          chart: {
    height: 300, // Set the height of the chart
    width: 900,  // Set the width of the chart
  },
  title: { text: "Temperature-Time Graph" },
  xAxis: { type: "datetime" },
  yAxis: { title: { text: "Temperature (°C)" } },
  series: []
  });

  // Hardcoded cell info
  const [cellInfo, setCellInfo] = useState({
    siteId: site.site,
    serialNumber: site.serial,
    cellNumber: site.cellNumber
  });
  


  // Fetch cell data on start date change
  useEffect(() => {
    const formattedDate = startDate.toISOString().slice(0, 10);
    fetchCellData(formattedDate);
  }, [startDate]);

  const fetchCellData = (date) => {
    // Ensure the date is a valid Date object
    if (typeof date === "string") {
      date = new Date(date);
    }
  
    if (!(date instanceof Date) || isNaN(date)) {
      console.error("Invalid date:", date);
      return;
    }
  
    // Format the date to 'YYYY-MM-DD HH:mm:ss'
    const formattedDate = date.toISOString().slice(0, 10); // 'YYYY-MM-DD'
    const startDateTime = `${formattedDate} 00:00:00`; // 'YYYY-MM-DD 00:00:00'
    const endDateTime = `${formattedDate} 23:59:59`; // 'YYYY-MM-DD 23:59:59'
  
    const apiUrl = `http://122.175.45.16:51270/getSpecificCellDataBySiteIdAndSerialNumberBetweenDates?siteId=${cellInfo.siteId}&serialNumber=${cellInfo.serialNumber}&cellNumber=${cellInfo.cellNumber}&strStartDate=${encodeURIComponent(
      startDateTime
    )}&strEndDate=${encodeURIComponent(endDateTime)}`;
  
    // Fetch data from the API
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setCellData(data);
        generateCharts(data.filter((cell) =>
          cell.cellVoltage !== 65.535 && cell.cellTemperature !== 65535)); // Generate charts based on fetched data
      }) 
      .catch((error) => {
        console.error("Error fetching cell data:", error);
      });
  };

  // Generate the charts based on data
  const generateCharts = (data) => {
    const voltageData = data.map((item) => ({
      x: new Date(item.packetDateTime).getTime(),
      y: item.cellVoltage,
    }));

    const temperatureData = data.map((item) => ({
      x: new Date(item.packetDateTime).getTime(),
      y: item.cellTemperature,
    }));
    const xAxisConfig = {
      type: "datetime",
      labels: {
        format: "{value:%Y-%m-%d %H:%M:%S}", // Shows date and time as YYYY-MM-DD HH:mm:ss
        rotation: -45, // Optional: Rotate labels for better readability
      },
      tickPixelInterval: 50, // Reduce the gap between labels for dense data
      tickInterval: 1 * 60 * 1000, // 1-minute intervals; adjust as needed
    };

    setVoltageChartOptions({
      chart: {
        type: 'line',
        height: 250, // Set the height of the chart
        width: 750,  // Set the width of the chart
      },
      title: { text: "Voltage-Time Graph" },
      xAxis: xAxisConfig,
      yAxis: { title: { text: "Voltage (V)" } },
      series: [{ name: "Voltage", data: voltageData, type: chartType }],
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 600,
            },
            chartOptions: {
              legend: {
                enabled: false,
              },
            },
          },
        ],
      },
      credits: {
        enabled: false, // Disable the watermark
      },
    });

    setTemperatureChartOptions({
      chart: {
        type: 'line',
        height: 250, // Set the height of the chart
        width: 750,  // Set the width of the chart
      },
      title: { text: "Temperature-Time Graph" },
      xAxis: xAxisConfig,
      yAxis: { title: { text: "Temperature (°C)" } },
      series: [{ name: "Temperature", data: temperatureData, type: chartType }],
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 600,
            },
            chartOptions: {
              legend: {
                enabled: false,
              },
            },
          },
        ],
      },
      credits: {
        enabled: false, // Disable the watermark
      },
    });
  };

  // Download cell data as Excel
  const downloadExcel = () => {
    // Format the start and end dates properly without encoding colons
    const startDateTime = `${startDate.toISOString().slice(0, 10)} 00:00:00`;
    const endDateTime = `${startDate.toISOString().slice(0, 10)} 23:59:59`;
  
    // Construct the download URL
    const url = `http://122.175.45.16:51470/downloadCellDataReport?siteId=${cellInfo.siteId}&serialNumber=${cellInfo.serialNumber}&cellNumber=${cellInfo.cellNumber}&strStartDate=${startDateTime}&strEndDate=${endDateTime}`;
  
    // Use an anchor element to trigger the download
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `CellData_${cellInfo.cellNumber}_${startDate.toISOString().slice(0, 10)}.xlsx`; // Suggest a filename
    document.body.appendChild(anchor); // Append the anchor to the body
    anchor.click(); // Trigger the download
    document.body.removeChild(anchor); // Clean up
  };
  

  return (
      <Box
      sx={{
        p: "13px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "70%",
        maxWidth: "1200px", // Limit max width of the content
         backgroundColor: "white", // Dark background for better contrast
        borderRadius: "10px",
        //  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
      }}
      >
      {/* Date Picker and Download Button Row */}
      <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      sx={{
        mb: 2,
        width: "100%",
        justifyContent: "space-between",
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
        "& .MuiInputBase-root": { height: "20px" }, // Set height correctly
        input: { color: "white" }, // Set text color to white
        label: { color: "white" }, // Set label color to white
        svg: { color: "white" }, // Set calendar icon color to white
      }}
    />
  )}
/>

</LocalizationProvider>

      </Box>

      {/* Cell Number Text */}
      <Box
        sx={{
          flex: 1, // Occupy equal space between DatePicker and IconButton
          textAlign: "center", // Center the text
        }}
      >
        <Typography variant="h6" sx={{ color: "black" }}>
          {`Cell Number: ${cellInfo.cellNumber}`}
        </Typography>
      </Box>

      {/* Download Button */}
      <Box sx={{ flex: 1, textAlign: "right",paddingRight:10 }}>
        <IconButton
          onClick={downloadExcel}
          aria-label="Download Excel"
          sx={{
            padding: 1,
            color: "black",
          }}
        >
          <FileDownloadIcon fontSize="large" />
        </IconButton>
      </Box>
    </Stack>


      {/* Card Container for Charts */}
      <Paper
      sx={{
        width: "100%",
        height: "500px", // Fixed height to enable scrolling
        // backgroundColor: "#1e1e1e",
        borderRadius: "10px",
        border: "1px solid #444",
        overflowY: "auto", // Enable vertical scrolling
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
          <HighchartsReact highcharts={Highcharts} options={voltageChartOptions} />
        </Box>

        {/* Temperature Chart */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <HighchartsReact highcharts={Highcharts} options={temperatureChartOptions} />
        </Box>
      </Box>
    </Paper>
      </Box>
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