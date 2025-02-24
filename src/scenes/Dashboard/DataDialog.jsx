import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TableContainer,
  Typography,
  TablePagination,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
const CustomTick = (props) => {
  const { x, y, payload } = props;
  return (
    <g transform={`translate(${x},${y}) rotate(-40)`}>
      <text 
        dy={10} 
        dx={5} 
        textAnchor="end" 
        fontSize={9} 
        
        fontWeight="bold" 
        fontFamily="Arial, sans-serif"
        style={{ whiteSpace: "nowrap", minWidth: "100px", display: "block" }}
      >
        {payload.value}
      </text>
    </g>
  );
};

// Table Dialog to display data in table format
const TableDialog = ({ open, handleClose, data, alarmType }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = data.details?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Determine which columns to display based on the alarm type
  const getTableColumns = () => {
    const baseColumns = [
      { id: "siteId", label: "Substation ID" },
      { id: "serialNumber", label: "Serial Number" },
    ];

    switch (data.name) {
      case "String(V) High":
        baseColumns.push({ id: "stringvoltage", label: "String Voltage High" });
        break;
      case "String Voltage Low":
        baseColumns.push({ id: "stringvoltage", label: "String Voltage Low" });
        break;
      case "Cell Voltage Low":
        baseColumns.push({ id: "cellVoltageLNH", label: "Cell Voltage Low" });
        break;
      case "SOC Low":
        baseColumns.push({ id: "socLN", label: "SOC Low" });
        break;
      case "Battery Condition":
        baseColumns.push({ id: "batteryCondition", label: "Battery Condition" });
        break;
      case "Charger Trip":
        baseColumns.push({ id: "chargerTrip", label: "Charger Trip" });
        break;
      case "String Voltage High (LNH)":
        baseColumns.push({ id: "stringVoltageLNHHigh", label: "String Voltage High (LNH)" });
        break;
      case "Cell(V) High":
        baseColumns.push({ id: "cellVoltageLNHHigh", label: "Cell Voltage High (LNH)" });
        break;
      case "String(A) High":
        baseColumns.push({ id: "stringCurrentHN", label: "String Current High" });
        break;
      case "Input Mains Fail":
        baseColumns.push({ id: "inputMains", label: "Input Mains" });
        break;
      case "Input Phase Fail":
        baseColumns.push({ id: "inputPhase", label: "Input Phase" });
        break;
      case "Rectifier Fuse Fail":
        baseColumns.push({ id: "rectifierFuse", label: "Rectifier Fuse" });
        break;
      case "Filter Fuse Fail":
        baseColumns.push({ id: "filterFuse", label: "Filter Fuse" });
        break;
      case "Output MCCB Fail":
        baseColumns.push({ id: "outputMccb", label: "Output MCCB" });
        break;
      case "Input Fuse Fail":
        baseColumns.push({ id: "inputFuse", label: "Input Fuse" });
        break;
      case "AC(V) ULN":
        baseColumns.push({ id: "acVoltageULN", label: "AC Voltage Low" });
        break;
      case "Ambient Temperature High":
        baseColumns.push({ id: "ambientTemperatureHN", label: "Ambient Temperature High" });
        break;
      case "Cell Communication Failure":
        baseColumns.push({ id: "cellCommunication", label: "Cell Communication" });
        break;
      case "DC Voltage Low":
        baseColumns.push({ id: "dcVoltageOLN", label: "DC Voltage Low" });
        break;
      case "DC Under Voltage Detection":
        baseColumns.push({ id: "acVoltageOLN", label: "AC Voltage Low (Output)" });
        break;
      case "Buzzer":
        baseColumns.push({ id: "buzzer", label: "Buzzer" });
        break;
      case "Charger Load":
        baseColumns.push({ id: "chargerLoad", label: "Charger Load" });
        break;
      case "Alarm Supply Fuse Failure":
        baseColumns.push({ id: "alarmSupplyFuse", label: "Alarm Supply Fuse" });
        break;
      case "Test Push Button":
        baseColumns.push({ id: "testPushButton", label: "Test Push Button" });
        break;
      case "Reset Push Button":
        baseColumns.push({ id: "resetPushButton", label: "Reset Push Button" });
        break;
      default:
        // No additional columns for unknown alarm types
        break;
    }

    return baseColumns;
  };

  const columns = getTableColumns();

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          backgroundImage:
            "linear-gradient(90deg, #00d4ff 0%, #090979 35%, #00d4ff 100%)",
          color: "white",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Data for {data.name} - {alarmType}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          <TableContainer
            component={Paper}
            sx={{
              marginTop: 1,
              overflowX: "auto",
              border: "1px solid black",
              borderRadius: "8px",
              paddingBottom: 3,
              height: "300px",
            }}
          >
            <Table aria-label="simple table">
              <TableHead sx={{ backgroundColor: "#d82b27", color: "#ffffff" }}>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      sx={{
                        border: "1px solid #ccc",
                        padding: "5px",
                        fontWeight: "bold",
                        color: "#ffffff",
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData?.map((item, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      "&:nth-of-type(odd)": { backgroundColor: "#fafafa" },
                      "&:hover": { backgroundColor: "#f0f0f0" },
                    }}
                  >
                    {columns.map((column) => (
                      <TableCell key={column.id}>
                        {item[column.id] || "-"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={data.details?.length || 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                borderTop: "1px solid #ccc",
                backgroundColor: "#f5f5f5",
              }}
            />
          </TableContainer>
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          sx={{
            backgroundColor: "red",
            color: "white",
            "&:hover": {
              backgroundColor: "#b30000",
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const DataDialog = ({
  openDialog,
  handleCloseDialog,
  selectedStatus,
  barChartData,
}) => {
  const [openTableDialog, setOpenTableDialog] = useState(false);
  const [tableData, setTableData] = useState(null);
  const [alarmType, setAlarmType] = useState("");

  // Mapping of status to gradient IDs
  const statusGradients = {
    "Most Critical Count": "mostcriticalGradient",
    "Critical Count": "CriticalGradient",
    "Major Count": "majorGradient",
    "Minor Count": "minoralarmsGradient",
  };

  // Determine the current gradient based on selected status
  const currentGradient = statusGradients[selectedStatus] || "defaultGradient";

  const handleBarClick = (data) => {
    const filteredData = barChartData.find((item) => item.name === data.name);
    if (filteredData) {
      // Filter details based on the selected alarm type
      const filteredDetails = filteredData.details.filter((detail) => {
        switch (data.name) {
          case "String(V) High":
            return detail.stringvoltage !== undefined;
          case "String Voltage Low":
            return detail.stringvoltage !== undefined;
          case "Cell Voltage Low":
            return detail.cellVoltageLNH !== undefined;
          case "SOC Low":
            return detail.socLatestValueForEveryCycle !== undefined;
          case "Battery Condition":
            return detail.batteryCondition !== undefined;
          case "Charger Trip":
            return detail.chargerTrip !== undefined;
          case "Cell(V) High":
            return detail.cellVoltageLNHHigh !== undefined;
          case "String(A) High":
            return detail.instantaneousCurrent !== undefined;
          case "String Voltage High (LNH)":
            return detail.stringVoltageLNHHigh !== undefined;
          case "Cell(V) High":
            return detail.cellVoltageLNHHigh !== undefined;
          case "String(A) High":
            return detail.stringCurrentHN !== undefined;
          case "Input Mains Fail":
            return detail.inputMains !== undefined;
          case "Input Phase Fail":
            return detail.inputPhase !== undefined;
          case "Rectifier Fuse Fail":
            return detail.rectifierFuse !== undefined;
          case "Filter Fuse Fail":
            return detail.filterFuse !== undefined;
          case "Output MCCB Fail":
            return detail.outputMccb !== undefined;
          case "Input Fuse Fail":
            return detail.inputFuse !== undefined;
          case "AC(V) ULN":
            return detail.acVoltage !== undefined;
          case "Ambient Temperature High":
            return detail.ambientTemperature !== undefined;
          case "Cell Communication Failure":
            return detail.cellCommunication !== undefined;
          case "DC Voltage Low":
            return detail.dcVoltageOLN !== undefined;
          case "DC Under Voltage Detection":
            return detail.acVoltage !== undefined;
          case "Buzzer":
            return detail.buzzer !== undefined;
          case "Charger Load":
            return detail.chargerLoad !== undefined;
          case "Alarm Supply Fuse Failure":
            return detail.alarmSupplyFuse !== undefined;
          case "Test Push Button":
            return detail.testPushButton !== undefined;
          case "Reset Push Button":
            return detail.resetPushButton !== undefined;
          default:
            return true; // Show all rows if no specific alarm type is selected
        }
      });

      setTableData({
        name: data.name,
        details: filteredDetails, // Use the filtered details
      });
      setAlarmType(selectedStatus); // Set the alarm type
      setOpenTableDialog(true);
    }
  };

  return (
    <>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="large"
        fullWidth
        sx={{ "& .MuiDialog-paper": { maxWidth: "1000px", padding: "16px" } }}
      >
        <DialogTitle
          sx={{
            backgroundImage:
              "linear-gradient(90deg, #00d4ff 0%, #090979 35%, #00d4ff 100%)",
            color: "white",
            fontWeight: "bold",
            textAlign: "center",
            padding: "10px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            marginBottom: "12px",
          }}
        >
          Alarms for {selectedStatus}
        </DialogTitle>
        <DialogContent style={{ padding: 5, margin: 0, paddingBottom:10 }}>
          {/* Define gradients */}
          <svg width={0} height={0} style={{ position: "absolute" }}>
            <defs>
              <linearGradient
                id="mostcriticalGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#DB3445" />
                <stop offset="100%" stopColor="#F71735" />
              </linearGradient>
              <linearGradient
                id="CriticalGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#d82b27" />
                <stop offset="100%" stopColor="#f09819" />
              </linearGradient>
              <linearGradient
                id="majorGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#9d50bb" />
                <stop offset="100%" stopColor="#6e48aa" />
              </linearGradient>
              <linearGradient
                id="minoralarmsGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#e8b409" />
                <stop offset="100%" stopColor="#f4ee2e" />
              </linearGradient>
              <linearGradient
                id="defaultGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#8884d8" />
                <stop offset="100%" stopColor="#8884d8" />
              </linearGradient>
            </defs>
          </svg>

          <ResponsiveContainer width="100%" height={350}>
          <BarChart 
              data={barChartData} 
              barSize={40} 
              margin={{ bottom: 40 }} // Adjust bottom margin to fit rotated labels
              barGap={1} 
              scale="linear"
            >
              <XAxis 
                dataKey="name" 
                interval={0} 
                angle={-45} 
                textAnchor="end" 
                dx={1} 
                dy={1} 
                tick={<CustomTick />} 
              />
              <YAxis 
                hide={true} 
                tick={{ fontSize: 0, color: "black", fontWeight: 500 }} 
                tickCount={10} 
                domain={[1, barChartData.length]} 
              />
              <Tooltip cursor={{ fill: "rgba(0, 0, 0, 0.1)" }} />
              <Bar 
                dataKey="count" 
                fill={`url(#${currentGradient})`} 
                onClick={handleBarClick}
              >
                <LabelList 
                  dataKey="count" 
                  position="top"
                  fontWeight="bold"
                  offset={5} 
                  style={{ fontSize: "12px", fontWeight: "bold" }} 
                />
              </Bar>
            </BarChart>

          </ResponsiveContainer>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            sx={{
              backgroundColor: "red",
              color: "white",
              "&:hover": {
                backgroundColor: "#b30000",
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Table Dialog */}
      <TableDialog
        open={openTableDialog}
        handleClose={() => setOpenTableDialog(false)}
        data={tableData || {}}
        alarmType={alarmType}
      />
    </>
  );
};

export default DataDialog;