import React, { useState,useContext,useEffect } from "react";
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
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../services/AppContext";
 
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
  const { setSiteId, setSerialNumber, handleSearch,siteId,serialNumber } = useContext(AppContext);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [clickedItem, setClickedItem] = useState(null);
  const navigate = useNavigate();

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

  // useEffect to trigger handleSearch and navigation after siteId and serialNumber are set
  useEffect(() => {
    let mounted = true;

    const performSearchAndNavigate = async () => {
      if (mounted && siteId && serialNumber) {
        const result = await handleSearch();
        if (result) {
          navigate("/livemonitoring");
        }
      }
    };

    // Trigger only if a row was clicked and both siteId and serialNumber are set
    if (clickedItem && siteId === clickedItem.siteId && serialNumber === clickedItem.serialNumber) {
      performSearchAndNavigate();
      // Reset clickedItem to prevent re-triggering
      setClickedItem(null);
    }

    return () => {
      mounted = false;
    };
  }, [siteId, serialNumber, handleSearch, navigate, clickedItem]);

  const handleRowClick = (item) => {
    setSiteId(item.siteId); // Update siteId in context
    setSerialNumber(item.serialNumber); // Update serialNumber in context
    setClickedItem(item); // Set local state to track the clicked row
  };
  const getTableColumns = () => {
    const baseColumns = [
      { id: "siteId", label: "Substation ID" },
      { id: "serialNumber", label: "Serial Number" },
    ];

    switch (data.name) {
      case "String(V) High":
        baseColumns.push({ id: "stringvoltage", label: "String Voltage High" });
        break;
      case "String(V) Low":
        baseColumns.push({ id: "stringvoltage", label: "String Voltage Low" });
        break;
      case "Cell(V) Low":
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
      case "Cell(V) High":
        baseColumns.push({ id: "cellVoltageLNH", label: "Cell Voltage High " });
        break;
      case "String(A) High":
        baseColumns.push({ id: "instantaneousCurrent", label: "String Current High" });
        break;
      case "String Commu":
        baseColumns.push({ id: "stringCommunication", label: "String Communication" });
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
      case "Output Fuse Fail":
        baseColumns.push({ id: "outputFuse", label: "Input Fuse" });
        break;
      case "AC(V) ULN":
        baseColumns.push({ id: "acVoltageULN", label: "AC Voltage Low" });
        break;
      case "Ambient (°C) High":
        baseColumns.push({ id: "ambientTemperature", label: "Ambient Temperature High" });
        break;
      case "Cell Comm Fail":
        baseColumns.push({ id: "cellCommunication", label: "Cell Communication" });
        break;
      case "DC Over Voltage":
        baseColumns.push({ id: "dcVoltageOLN", label: "DC Voltage High" });
        break;
      case "DC Under Voltage":
        baseColumns.push({ id: "dcVoltageOLN", label: "DC Voltage Low" });
        break;
      case "Battery Bank(Discharging)":
        baseColumns.push({ id: "bankDischargeCycle", label: "Battery Bank(Discharging)" });
        break;
      case "AC(V) High":
        baseColumns.push({ id: "acVoltage", label: "AC Voltage High" });
        break;
      case "AC Under Voltage":
        baseColumns.push({ id: "acVoltage", label: "AC Voltage Low" });
        break;
      case "Buzzer Alarm":
        baseColumns.push({ id: "buzzer", label: "Buzzer" });
        break;
      case "Charger Load":
        baseColumns.push({ id: "chargerLoad", label: "Charger Load" });
        break;
      case "Alarm Supply Fuse Fail":
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
         {data.name} - {alarmType}
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
                        padding: "3px",
                        fontWeight: "bold",
                        color: "#ffffff",
                        whiteSpace: "nowrap",
                        textAlign:"center"
                        
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
                onClick={() => handleRowClick(item)}
                sx={{
                  "&:nth-of-type(odd)": { backgroundColor: "#fafafa" },
                  "&:hover": { backgroundColor: "#f0f0f0", cursor: "pointer" },
                }}
              >
                {columns.map((column) => (
                <TableCell key={column.id} 
                style={column.id === 'siteId' ? { 
                  color: "#1976d2", 
                  textDecoration: "underline", 
                  cursor: "pointer",
                  border: '1px solid #ccc',
                  padding: '3px',
                  fontWeight: 'bold',
                  whiteSpace: "nowrap",
                  textAlign: "center"
                } : {}}
                title={column.id === 'siteId' ? 'Double tap here' : undefined}
              >
                {column.id === 'dcVoltageOLN' || column.id === 'cellVoltageLNH'
                  ? (item[column.id] === 0 ? 'Low' : item[column.id] === 1 ? 'Normal' : item[column.id] === 2 ? 'Over' : item[column.id])
                  : typeof item[column.id] === 'boolean'
                  ? item[column.id]
                    ? 'Fail'
                    : 'Normal'
                  : item[column.id] !== undefined && item[column.id] !== null
                  ? item[column.id]
                  : 'No Data'}
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
          case "String(V) Low":
            return detail.stringvoltage !== undefined;
          case "Cell(V) Low":
            return detail.cellVoltageLNH !== undefined;
          case "SOC Low":
            return detail.socLatestValueForEveryCycle !== undefined;
          case "Battery Condition":
            return detail.batteryCondition !== undefined;
          case "Charger Trip":
            return detail.chargerTrip !== undefined ;
          case "Cell(V) High":
            return detail.cellVoltageLNH !== undefined ;
          case "String(A) High":
            return detail.instantaneousCurrent !== undefined;
          case "Battery Bank(Discharging)":
              return detail.bankDischargeCycle!== undefined ;
          case "String Commu":
            return detail.bmsSedCommunication !== undefined ;
          case "Input Mains Fail":
            return detail.inputMains !== undefined
          case "Input Phase Fail":
            return detail.inputPhase !== undefined;
          case "Rectifier Fuse Fail":
            return detail.rectifierFuse !== undefined;
          case "Filter Fuse Fail":
            return detail.filterFuse !== undefined;
          case "Output Fuse Fail":
              return detail.outputFuse !== undefined;
          case "Output MCCB Fail":
            return detail.outputMccb !== undefined;
          case "Input Fuse Fail":
            return detail.inputFuse !== undefined;
          case "AC Under Voltage":
            return detail.acVoltage !== undefined;
          case "AC(V) High":
            return detail.acVoltage !== undefined;
          case "Ambient (°C) High":
            return detail.ambientTemperature !== undefined;
          case "Cell Comm Fail":
            return detail.cellCommunication !== undefined;
          case "DC Under Voltage":
            return detail.dcVoltageOLN !== undefined;
          case "DC Over Voltage":
            return detail.dcVoltageOLN !== undefined;
          case "Buzzer Alarm":
            return detail.buzzer !== undefined;
          case "Charger Load":
            return detail.chargerLoad !== undefined;
          case "Alarm Supply Fuse Fail":
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