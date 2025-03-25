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
  const { setSiteId, setSerialNumber, handleSearch, siteId, serialNumber } = useContext(AppContext);
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

  useEffect(() => {
    let mounted = true;

    const performSearchAndNavigate = async () => {
      if (mounted && siteId && serialNumber) {
        const result = await handleSearch();
        if (result) {
          navigate("/livemonitoring", { state: { from: "/" } });
        }
      }
    };

    if (clickedItem && siteId === clickedItem.siteId && serialNumber === clickedItem.serialNumber) {
      performSearchAndNavigate();
      setClickedItem(null);
    }

    return () => {
      mounted = false;
    };
  }, [siteId, serialNumber, handleSearch, navigate, clickedItem]);

  const handleRowClick = (item) => {
    setSiteId(item.siteId);
    setSerialNumber(item.serialNumber);
    setClickedItem(item);
  };

  const getTableColumns = () => {
    const baseColumns = [
      { id: "siteId", label: "Substation ID" },
      { id: "serialNumber", label: "Serial Number" },
      { id: "serverTime", label: "Server Date Time" },
      {
        id: "value",
        label: data.name,
        render: (item) =>
          typeof item.value === "boolean"
            ? !item.value // Reverse the boolean
              ? "Normal"
              : "Fail"
            : `${item.value}${item.units ? " " + item.units : ""}`,
      },
    ];

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
                      textAlign: "center",
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
                    <TableCell
                      key={column.id}
                      style={
                        column.id === "siteId"
                          ? {
                              color: "#1976d2",
                              textDecoration: "underline",
                              cursor: "pointer",
                              border: "1px solid #ccc",
                              padding: "3px",
                              fontWeight: "bold",
                              whiteSpace: "nowrap",
                              textAlign: "center",
                            }
                          : {
                              border: "1px solid #ccc",
                              padding: "3px",
                              whiteSpace: "nowrap",
                              textAlign: "center",
                            }
                      }
                      title={column.id === "siteId" ? "Double tap here" : undefined}
                    >
                      {column.id === "serverTime" && item[column.id]
                        ? new Date(item[column.id]).toLocaleString("en-GB", {
                            day: "numeric",
                            month: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                            second: "numeric",
                            hour12: true,
                          })
                        : column.render
                        ? column.render(item) // Use render for value column
                        : typeof item[column.id] === "boolean"
                        ? !item[column.id] // Reverse boolean for other columns
                          ? "True"
                          : "False"
                        : item[column.id] !== undefined && item[column.id] !== null
                        ? item[column.id]
                        : "No Data"}
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
    "Most Critical Alarm": "mostcriticalGradient",
    "Critical Alarm": "CriticalGradient",
    "Major Alarm": "majorGradient",
    "Minor Alarm": "minoralarmsGradient",
  };

  // Determine the current gradient based on selected status
  const currentGradient = statusGradients[selectedStatus] || "defaultGradient";

  const handleBarClick = (data) => {
    const filteredData = barChartData.find((item) => item.name === data.name);
    if (filteredData) {
      const filteredDetails = filteredData.details
        .map((detail) => {
          switch (data.name) {
            case "String(V) High":
            case "String(V) Low":
              if (detail.stringvoltage !== undefined) {
                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  value: detail.stringvoltage,
                  units: "V",
                };
              }
              break;
                case "DC Under Voltage":
                  if (detail.stringvoltage !== undefined) {
                    return {
                      siteId: detail.siteId,
                      serialNumber: detail.serialNumber,
                      serverTime: detail.serverTime,
                      value: detail.stringvoltage,
                      units: "V",
                    };
                  }
              break;
              case "Cell(V) Low":
                if (detail.cellVoltageLow !== undefined && Array.isArray(detail.cellVoltageLow)) {
                    // Format the cellVoltageLow array into a readable string
                    const formattedValue = detail.cellVoltageLow
                        .map(cell => `Cell ${cell.cellNumber}: ${cell.cellVoltage}V`)
                        .join(", ");
            
                    return {
                        siteId: detail.siteId,
                        serialNumber: detail.serialNumber,
                        serverTime: detail.serverTime,
                        value: formattedValue || "No low voltage cells", // Fallback if array is empty
                        units: "V",
                    };
                } else if (typeof detail.cellVoltageLow === "string") {
                    // If cellVoltageLow is already a string (e.g., "No low voltage cells")
                    return {
                        siteId: detail.siteId,
                        serialNumber: detail.serialNumber,
                        serverTime: detail.serverTime,
                        value: detail.cellVoltageLow,
                        units: "V",
                    };
                } else {
                    // Fallback for unexpected cases
                    return {
                        siteId: detail.siteId,
                        serialNumber: detail.serialNumber,
                        serverTime: detail.serverTime,
                        value: "No data available",
                        units: "V",
                    };
                }
                break;
            
            case "Cell(V) High":
                if (detail.cellVoltageHigh !== undefined && Array.isArray(detail.cellVoltageHigh)) {
                    // Format the cellVoltageHigh array into a readable string
                    const formattedValue = detail.cellVoltageHigh
                        .map(cell => `Cell ${cell.cellNumber}: ${cell.cellVoltage}V`)
                        .join(", ");
            
                    return {
                        siteId: detail.siteId,
                        serialNumber: detail.serialNumber,
                        serverTime: detail.serverTime,
                        value: formattedValue || "No high voltage cells", // Fallback if array is empty
                        units: "V",
                    };
                } else if (typeof detail.cellVoltageHigh === "string") {
                    // If cellVoltageHigh is already a string (e.g., "No high voltage cells")
                    return {
                        siteId: detail.siteId,
                        serialNumber: detail.serialNumber,
                        serverTime: detail.serverTime,
                        value: detail.cellVoltageHigh,
                        units: "V",
                    };
                } else {
                    // Fallback for unexpected cases
                    return {
                        siteId: detail.siteId,
                        serialNumber: detail.serialNumber,
                        serverTime: detail.serverTime,
                        value: "No data available",
                        units: "V",
                    };
                }
                break;
              case "Cell Temperature":
              if (detail.cellTemperature !== undefined) {
                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  value: detail.cellTemperature,
                  units: "°C",
                };
              }
              break;
              case "DC Over Voltage":
                  if (detail.stringvoltage !== undefined) {
                    return {
                      siteId: detail.siteId,
                      serialNumber: detail.serialNumber,
                      serverTime: detail.serverTime,
                      value: detail.stringvoltage,
                      units: "V",
                    };
                  }
              break;
            case "SOC Low":
              if (detail.socLatestValueForEveryCycle !== undefined) {
                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  value: detail.socLatestValueForEveryCycle,
                  units: "%",
                };
              }
              break;
            case "Battery Condition":
              if (detail.batteryCondition !== undefined) {
                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  value: detail.batteryCondition,
                  units: "",
                };
              }
              break;
            case "Charger Trip":
              if (detail.chargerTrip !== undefined) {
                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  value: detail.chargerTrip,
                  units: "",
                };
              }
              break;
            case "String(A) High":
              if (detail.instantaneousCurrent !== undefined) {
                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  value: detail.instantaneousCurrent,
                  units: "A",
                };
              }
              break;
            case "Battery Bank(Discharging)":
              if (detail.bankDischargeCycle !== undefined) {
                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  value: detail.bankDischargeCycle,
                  units: "",
                };
              }
              break;
            case "String Commu":
              if (detail.bmsSedCommunication !== undefined) {
                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  value: detail.bmsSedCommunication,
                  units: "",
                };
              }
              break;
            case "Input Mains Fail":
              if (detail.inputMains !== undefined) {
                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  value: detail.inputMains,
                  units: "",
                };
              }
              break;
            case "Input Phase Fail":
              if (detail.inputPhase !== undefined) {
                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  value: detail.inputPhase,
                  units: "",
                };
              }
              break;
            case "Rectifier Fuse Fail":
              if (detail.rectifierFuse !== undefined) {
                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  value: detail.rectifierFuse,
                  units: "",
                };
              }
              break;
            case "Filter Fuse Fail":
              if (detail.filterFuse !== undefined) {
                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  value: detail.filterFuse,
                  units: "",
                };
              }
              break;
            case "Output Fuse Fail":
              if (detail.outputFuse !== undefined) {
                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  value: detail.outputFuse,
                  units: "",
                };
              }
              break;
            case "Output MCCB Fail":
              if (detail.outputMccb !== undefined) {
                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  value: detail.outputMccb,
                  units: "",
                };
              }
              break;
            case "Input Fuse Fail":
              if (detail.inputFuse !== undefined) {
                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  value: detail.inputFuse,
                  units: "",
                };
              }
              break;
            case "AC Under Voltage":
            case "AC(V) High":
              if (detail.acVoltage !== undefined) {
                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  value: detail.acVoltage,
                  units: "V",
                };
              }
              break;
            case "Ambient (°C) High":
              if (detail.ambientTemperature !== undefined) {
                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  value: detail.ambientTemperature,
                  units: "°C",
                };
              }
              break;
              case "Battery Open":
                if (detail.cellVoltageOpenBattery !== undefined && Array.isArray(detail.cellVoltageOpenBattery)) {
                    // Format the cellVoltageOpenBattery array into a readable string
                    const formattedValue = detail.cellVoltageOpenBattery
                        .map(cell => `Cell ${cell.cellNumber}: ${cell.cellVoltage}V`)
                        .join(", ");
            
                    return {
                        siteId: detail.siteId,
                        serialNumber: detail.serialNumber,
                        serverTime: detail.serverTime,
                        value: formattedValue || "No open battery cells", // Fallback if array is empty
                        units: "V",
                    };
                } else if (typeof detail.cellVoltageOpenBattery === "string") {
                    // If cellVoltageOpenBattery is already a string (e.g., "No open battery cells")
                    return {
                        siteId: detail.siteId,
                        serialNumber: detail.serialNumber,
                        serverTime: detail.serverTime,
                        value: detail.cellVoltageOpenBattery,
                        units: "V",
                    };
                } else {
                    // Fallback for unexpected cases
                    return {
                        siteId: detail.siteId,
                        serialNumber: detail.serialNumber,
                        serverTime: detail.serverTime,
                        value: "No data available",
                        units: "V",
                    };
                }
                break;
            
            case "Battery AboutToDie":
                if (detail.cellVoltageAboutToDie !== undefined && Array.isArray(detail.cellVoltageAboutToDie)) {
                    // Format the cellVoltageAboutToDie array into a readable string
                    const formattedValue = detail.cellVoltageAboutToDie
                        .map(cell => `Cell ${cell.cellNumber}: ${cell.cellVoltage}V`)
                        .join(", ");
            
                    return {
                        siteId: detail.siteId,
                        serialNumber: detail.serialNumber,
                        serverTime: detail.serverTime,
                        value: formattedValue || "No about to die cells", // Fallback if array is empty
                        units: "V",
                    };
                } else if (typeof detail.cellVoltageAboutToDie === "string") {
                    // If cellVoltageAboutToDie is already a string (e.g., "No about to die cells")
                    return {
                        siteId: detail.siteId,
                        serialNumber: detail.serialNumber,
                        serverTime: detail.serverTime,
                        value: detail.cellVoltageAboutToDie,
                        units: "V",
                    };
                } else {
                    // Fallback for unexpected cases
                    return {
                        siteId: detail.siteId,
                        serialNumber: detail.serialNumber,
                        serverTime: detail.serverTime,
                        value: "No data available",
                        units: "V",
                    };
                }
                break;
                  break;
                  case "Cell Comm Fail":
                    if (detail.cellNotComm !== undefined && Array.isArray(detail.cellNotComm)) {
                        const formattedValue = detail.cellNotComm
                        .map(cell => {
                          const voltage = (typeof cell.cellVoltage === 'number' && !isNaN(cell.cellVoltage)) 
                            ?'N/A'
                            : 'N/A';
                          return `Cell ${cell.cellNumber}: ${voltage}`;
                        })
                        .join(", ");
                
                        return {
                            siteId: detail.siteId,
                            serialNumber: detail.serialNumber,
                            serverTime: detail.serverTime,
                            value: formattedValue || "No non-communicating cells", // Fallback if array is empty
                            units: "",
                        };
                    } else if (typeof detail.cellNotComm === "string") {
                        // If cellNotComm is already a string (e.g., "No non-communicating cells")
                        return {
                            siteId: detail.siteId,
                            serialNumber: detail.serialNumber,
                            serverTime: detail.serverTime,
                            value: detail.cellNotComm,
                            units: "",
                        };
                    } else {
                        // Fallback for unexpected cases
                        return {
                            siteId: detail.siteId,
                            serialNumber: detail.serialNumber,
                            serverTime: detail.serverTime,
                            value: "No data available",
                            units: "",
                        };
                    }
                    break;
           
            case "Buzzer Alarm":
              if (detail.buzzer !== undefined) {
                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  value: detail.buzzer,
                  units: "",
                };
              }
              break;
            case "Charger Load":
              if (detail.chargerLoad !== undefined) {
                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  value: detail.chargerLoad,
                  units: "",
                };
              }
              break;
            case "Alarm Supply Fuse Fail":
              if (detail.alarmSupplyFuse !== undefined) {
                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  value: detail.alarmSupplyFuse,
                  units: "",
                };
              }
              break;
            case "Test Push Button":
              if (detail.testPushButton !== undefined) {
                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  value: detail.testPushButton,
                  units: "",
                };
              }
              break;
            case "Reset Push Button":
              if (detail.resetPushButton !== undefined) {
                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  value: detail.resetPushButton,
                  units: "",
                };
              }
              break;
            default:
              return {
                siteId: detail.siteId,
                serialNumber: detail.serialNumber,
                serverTime: detail.serverTime,
                value: detail, // Keep entire detail object as fallback
                units: "",
              };
          }
          return null; // Filter out non-matching cases
        })
        .filter((item) => item !== null);
  
      setTableData({
        name: data.name,
        details: filteredDetails,
      });
      setAlarmType(selectedStatus);
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
          {selectedStatus}
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