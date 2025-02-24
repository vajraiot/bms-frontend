import React, { useContext,useState } from "react";
import { useTheme,IconButton,Box } from "@mui/material";
import { ColorModeContext, tokens } from "../../../theme";
import { AppContext } from "../../../services/AppContext";
import ReportsBar from "../ReportsBar/ReportsBar";
import excelIcon from "../../../assets/images/png/ExcellTrans100_98.png";
import * as XLSX from "xlsx";
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
  siteId: "Site ID",
  serialNumber: "Serial Number",
  bankCycle: "Bank Status",
  ambientTemperature: "Ambient Temperature",
  soc: "State Of Charge",
  stringVoltage: "String Voltage",
  stringCurrent: "String Current",
  bmsSedCommunication: "BMS Sed Communication",
  cellCommunication: "Cell Communication",
  cellVoltage: "Cell Voltage",
  cellTemperature: "Cell Temperature",
  buzzer: "Buzzer",
  ebStatus: "EB Status",
  packetDateTime: "Packet DateTime",
  inputMains: "Input Mains",
  inputFuse: "Input Fuse",
  rectifierFuse: "Rectifier Fuse",
  filterFuse: "Filter Fuse",
  dcVoltageOLN: "DC Voltage OLN",
  outputFuse: "Output Fuse",
  acUnderVoltage: "AC Under Voltage",
  chargerLoad: "Charger Load",
  alarmSupplyFuse: "Alarm Supply Fuse",
  chargerTrip: "Charger Trip",
  outputMccb: "Output MCCB",
  acVoltageC: "AC Voltage C",
  batteryCondition: "Battery Condition",
  testPushButton: "Test Push Button",
  resetPushButton: "Reset Push Button",
};

const Alarms = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const { data = [] } = useContext(AppContext);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(100);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("siteId");
  const [pageType, setPageType] = useState(0);

  const handleRequestSort = (property) => {
    const isAscending = orderBy === property && order === "asc";
    setOrder(isAscending ? "desc" : "asc");
    setOrderBy(property);
  };


  function TimeFormat(dateString) {
    // Parse the UTC date-time string into a Date object

    if(dateString==null){
      return "";
    }
    const utcDate = new Date(dateString);

    // Return the formatted date as 'YYYY-MM-DD HH:MM:SS.mmm'
    const year = utcDate.getFullYear();
    const month = String(utcDate.getMonth() + 1).padStart(2, '0');
    const day = String(utcDate.getDate()).padStart(2, '0');
    const hours = String(utcDate.getHours()).padStart(2, '0');
    const minutes = String(utcDate.getMinutes()).padStart(2, '0');
    const seconds = String(utcDate.getSeconds()).padStart(2, '0');
    const milliseconds = String(utcDate.getMilliseconds()).padStart(3, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const dataArray = data.content; 
  const combineAlarmsData = (dataArray) => {
    if (!dataArray || dataArray.length === 0) return [];
  
    const combinedData = {};
  
    // Step 1: Combine objects with the same id
    dataArray.forEach((current) => {
      const { id, bmsalarmsString, deviceId, bmsManufacturerID, installationDate, cellsConnectedCount, problemCells, siteId, serialNumber,...rest } = current;  
      if (!combinedData[current.id]) {
        combinedData[current.id] = { ...rest }; 
      } else {
       
        combinedData[current.id] = { ...combinedData[current.id], ...rest };
      }
    });
  
   
    const rows = Object.values(combinedData);
  
   
    return rows.map((row) => {
      const { packetDateTime, ...rest } = row; 
      return { packetDateTime, ...rest }; 
    });
  };
  
  
  const sortedData = (dataArray) => {
    return [...dataArray].sort((a, b) => {
      if (order === "asc") {
        return a[orderBy] > b[orderBy] ? 1 : -1;
      }
      return a[orderBy] < b[orderBy] ? 1 : -1;
    });
  };
 
  const formattedData = combineAlarmsData(dataArray);
  const displayedData = sortedData(formattedData);
  const handleDownloadExcel = () => {
    if (formattedData.length === 0) {
      alert("No data available for download.");
      return;
    }

    const workbook = XLSX.utils.book_new();
    const excelData = displayedData.map((row) =>
      Object.keys(row).map((key) =>
        key === "packetDateTime" ? TimeFormat(row[key]) : row[key] || "No Data"
      )
    );
    const headers = Object.keys(formattedData[0]).map(
      (key) => columnMappings[key] || key
    );
    excelData.unshift(headers);
    const worksheet = XLSX.utils.aoa_to_sheet(excelData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Alarms Data");
    XLSX.writeFile(workbook, "Alarms_Report.xlsx");
  };

  console.log(formattedData); 
  return (
    <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <ReportsBar pageType="alarms" />
        <IconButton onClick={handleDownloadExcel} color="primary" aria-label="Download Excel">
  <img src={excelIcon} alt="Download Excel" style={{ width: "24px", height: "24px" }} />
</IconButton>

      </div>


      {formattedData && formattedData.length > 0 ? (
        <Box padding ="0px 10px 0px 10px">
          <TableContainer
            component={Paper}
            sx={{
              marginTop: 1,
              overflowX: "auto",
              border: "1px solid black",
              borderRadius: "8px",
              paddingBottom: 3,
              height: '379px',
            }}
          >
            <Table stickyHeader aria-label="sticky table">
              {/* Table Header */}
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
                      }}
                    >
                      <TableSortLabel
                        active={orderBy === key}
                        direction={orderBy === key ? order : "asc"}
                        onClick={() => handleRequestSort(key)}
                        aria-label={`Sort by ${columnMappings[key] || key}`}
                      >
                        {columnMappings[key] || key} {/* Map column names */}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              {/* Table Body */}
              <TableBody sx={{overflowY:'auto'}}>
                {displayedData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:hover": { backgroundColor: "#e1e2fe" },
                      }}
                    >
                      {/* Render each value in the row */}
                      {Object.entries(row).map(([key, value], idx) => (
                        <TableCell
                          key={idx}
                          sx={{ 
                            border: '1px solid #ccc',
                            padding: '3px',
                            fontWeight: 'bold',
                            whiteSpace: "nowrap",
                          }}
                        >
                          {key === 'dcVoltageOLN'
                            ? (value === 0 ? 'Low' : value === 1 ? 'Normal' : value === 2 ? 'Over' : value) // Custom mapping for dcVoltageOLN
                            : typeof value === 'boolean'
                            ? value
                              ? 'Fail' // If true, show 'Fail'
                              : 'Normal' // If false, show 'Normal'
                              : key === 'packetDateTime'
                              ? TimeFormat(value)
                            : value !== undefined && value !== null
                            ? value // Otherwise, just show the actual value
                            : 'No Data'}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[100, 200, 500,1000,1500,2000]}
            component="div"
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
    </div>
  );
};

export default Alarms;
