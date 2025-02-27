import React, { useContext, useState } from "react";
import { useTheme, IconButton, Box } from "@mui/material";
import { ColorModeContext, tokens } from "../../../theme";
import { AppContext } from "../../../services/AppContext";
import excelIcon from "../../../assets/images/png/ExcellTrans100_98.png";
import ReportsBar from "../ReportsBar/ReportsBar";
import ChargingGraph from "./ChargingGraph";
import AhGraph from "./AhGraph";
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
  dayWiseDate: "Date",
  chargeOrDischargeCycle: "Charge/Discharge Cycle",
  cumulativeAHIn: "Cumulative AH In",
  cumulativeAHOut: "Cumulative AH Out",
  totalChargingEnergy: "Total Charging Energy",
  totalDischargingEnergy: "Total Discharging Energy",
  batteryRunHours: "Battery Run Hours",
  totalSoc:"SOC",
  cumulativeTotalAvgTemp:"Temperature",
};

const DayWise = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const { data = [] } = useContext(AppContext);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("dayWiseDate");
  const [pageType, setPageType] = useState(0);

  const handleRequestSort = (property) => {
    const isAscending = orderBy === property && order === "asc";
    setOrder(isAscending ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleDownloadExcel = () => {
    const workbook = XLSX.utils.book_new();
    const excelData = displayedData.map((row) => {
      return Object.keys(row).map((key) => {
        return row[key] !== undefined && row[key] !== null ? row[key] : "No Data";
      });
    });
    const headers = Object.keys(formattedData[0]).map((key) => columnMappings[key] || key);
    excelData.unshift(headers);
    const worksheet = XLSX.utils.aoa_to_sheet(excelData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "DayWise Data");
    XLSX.writeFile(workbook, "DayWise_Data.xlsx");
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

    const formattedData = data.map((row) => {
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
        chargeOrDischargeCycle: chargeOrDischargeCycle,
        cumulativeAHIn: formatToTwoDecimals(cumulativeAHIn),
        cumulativeAHOut: formatToTwoDecimals(cumulativeAHOut),
        totalChargingEnergy: formatToTwoDecimals(totalChargingEnergy),
        totalDischargingEnergy: formatToTwoDecimals(totalDischargingEnergy),
        totalSoc: totalSoc,
        cumulativeTotalAvgTemp: formatToTwoDecimals(cumulativeTotalAvgTemp),

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

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <ReportsBar pageType="daywise" />
        <IconButton onClick={handleDownloadExcel} color="primary" aria-label="Download Excel">
          <img src={excelIcon} alt="Download Excel" style={{ width: "24px", height: "24px" }} />
        </IconButton>
      </div>

      {/* Scrollable Content */}
      <Box
        sx={{
          height: "calc(100vh - 200px)", // Adjust height as needed
          overflowY: "auto", // Enable vertical scrolling
          padding: "10px",
        }}
      >
        {/* Graphs Section */}
        <div style={{paddingBottom:"10px"}}>
        <Box paddingBottom={2}>
        <Paper elevation={10}  >
          {formattedData && formattedData.length > 0 ? <AhGraph data={data}  /> : ""}
          </Paper>
          </Box>
          <Paper elevation={10} >
          {formattedData && formattedData.length > 0 ? <ChargingGraph data={data}  /> : ""}
          </Paper>
        </div>

        {/* Table Section */}
        {formattedData && formattedData.length > 0 ? (
          <Box padding="0px 10px 0px 10px">
            <TableContainer
              component={Paper}
              sx={{
                marginTop: 1,
                overflowX: "auto",
                border: "1px solid black",
                borderRadius: "8px",
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
                          <TableCell
                            key={idx}
                            sx={{
                              border: '1px solid #ccc',
                              padding: '5px',
                              fontWeight: 'bold',
                              textAlign:"center"
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

            {/* Pagination */}
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
        ) : (
          <Typography variant="body1" sx={{ marginTop: 2 }}>
            No data available
          </Typography>
        )}
      </Box>
    </div>
  );
};

export default DayWise;