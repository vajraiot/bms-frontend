import React, { useState, useEffect, useContext } from "react";
import { Box, Grid } from "@mui/material";
import "leaflet/dist/leaflet.css";
import DashBoardBar from "../Dashboard/DashBoardBar/DashBoardBar";
import { AppContext } from "../../services/AppContext";
import { fetchCommunicationStatus } from "../../services/apiService";
import PieChartComponent2 from './PieChartComponent2';
import PieChartComponent from './PieChartComponent';
import MapComponent from './MapComponent';
import DataDialog from "./DataDialog";

const Dashboard = () => {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { data = [], mapMarkers, setMapMarkers, marginMinutes } = useContext(AppContext);
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [siteId, setSiteId] = useState('');
  const [barChartData, setBarChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchCommunicationStatus(marginMinutes);
        console.log("Fetched Communication Data:", response);

        if (!response || !Array.isArray(response)) {
          console.error("Invalid API response:", response);
          return;
        }

        let communicatingCount = 0;
        let nonCommunicatingCount = 0;
        let mostCriticalCount = 0;
        let criticalCount = 0;
        let majorCount = 0;
        let minorCount = 0;
        const markers = [];

        response.forEach((item) => {
          if (item.statusType === 1) communicatingCount++;
          else if (item.statusType === 0) nonCommunicatingCount++;

          const bmsAlarms = item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO || {};
          const chargerMonitoring = item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO || {};
          const threshold = item?.siteLocationDTO?.manufacturerDTO || {};
          const cellVoltageData = item?.generalDataDTO?.deviceDataDTO?.[0]?.cellVoltageTemperatureData || [];

          const batteryAboutToDieThreshold = parseFloat(threshold.batteryAboutToDie) || 0;
          const openBatteryThreshold = parseFloat(threshold.openBattery) || 0;
          const lowVoltageThreshold = parseFloat(threshold.lowVoltage) || 0;

          const isBatteryAboutToDie = cellVoltageData.some(cell =>
            cell.cellVoltage <= batteryAboutToDieThreshold &&
            cell.cellVoltage > openBatteryThreshold &&
            cell.cellVoltage < lowVoltageThreshold
          );
          const isOpenBattery = cellVoltageData.some(cell => cell.cellVoltage <= openBatteryThreshold);
          const isLowVoltageConditionMet = cellVoltageData.some(cell => cell.cellVoltage === lowVoltageThreshold);

          if (isBatteryAboutToDie || isOpenBattery || bmsAlarms.stringVoltageLNH === 0 ||
              (bmsAlarms.cellVoltageLN === true && isLowVoltageConditionMet) ||
              bmsAlarms.socLN === true || chargerMonitoring.chargerTrip === true) {
            mostCriticalCount++;
          }

          if (bmsAlarms.stringVoltageLNH === 2 || bmsAlarms.cellVoltageNH === true ||
              bmsAlarms.stringCurrentHN === true || chargerMonitoring.inputMains === true ||
              chargerMonitoring.inputPhase === true || chargerMonitoring.rectifierFuse === true ||
              chargerMonitoring.filterFuse === true || chargerMonitoring.outputMccb === true ||
              chargerMonitoring.batteryCondition === true || chargerMonitoring.inputFuse === true ||
              chargerMonitoring.acVoltageULN === 2) {
            criticalCount++;
          }

          if (bmsAlarms.ambientTemperatureHN === true || bmsAlarms.cellCommunication === true ||
              chargerMonitoring.dcVoltageOLN === 2 || chargerMonitoring.dcVoltageOLN === 0 ||
              chargerMonitoring.acVoltageULN === 0 || chargerMonitoring.outputFuse === true) {
            majorCount++;
          }

          if (bmsAlarms.bankDischargeCycle === true || bmsAlarms.bmsSedCommunication === true ||
              bmsAlarms.cellTemperatureHN === true || bmsAlarms.buzzer === true ||
              chargerMonitoring.chargerLoad === true || chargerMonitoring.alarmSupplyFuse === true ||
              chargerMonitoring.testPushButton === true || chargerMonitoring.resetPushButton === true) {
            minorCount++;
          }

          if (item.siteLocationDTO) {
            const { latitude, longitude, area, vendorName, siteId } = item.siteLocationDTO;
            if (latitude && longitude) {
              const serialNumber = item.generalDataDTO?.deviceDataDTO?.[0]?.serialNumber || "N/A";
              markers.push({
                lat: latitude,
                lng: longitude,
                name: area || "Unnamed Site",
                vendor: vendorName,
                statusType: item.statusType,
                siteId,
                serialNumber,
              });
            }
          }
        });

        setData1([
          { name: "Communicating", value: communicatingCount },
          { name: "Non-Communicating", value: nonCommunicatingCount },
        ]);

        setData2([
          { name: "Most Critical Alarm", value: mostCriticalCount },
          { name: "Critical Alarm", value: criticalCount },
          { name: "Major Alarm", value: majorCount },
          { name: "Minor Alarm", value: minorCount },
        ]);

        setMapMarkers(markers);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [marginMinutes, setMapMarkers]);

  const handlePieClick = async (data) => {
    setSelectedStatus(data.name);
    setOpenDialog(true);

    const filterData = (response, conditions) => {
      return response.filter((item) => {
        const bmsAlarms = item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO || {};
        const chargerMonitoring = item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO || {};
        const threshold = item?.siteLocationDTO?.manufacturerDTO || {};
        const cellVoltageTemperatureData = item?.generalDataDTO?.deviceDataDTO?.[0]?.cellVoltageTemperatureData || [];
        return conditions(bmsAlarms, chargerMonitoring, threshold, cellVoltageTemperatureData);
      });
    };

    const generateChartData = (filteredData, alarmType, condition) => {
      const validData = filteredData.filter(item => item && condition(item));
      const count = validData.length;
      const details = validData.map((item) => {
        const threshold = item.siteLocationDTO?.manufacturerDTO || {};
        const cellData = item.generalDataDTO?.deviceDataDTO?.[0]?.cellVoltageTemperatureData || [];

        const aboutToDieVoltage = parseFloat(threshold.batteryAboutToDie) || 0;
        const lowVoltage = parseFloat(threshold.lowVoltage) || 0;
        const highVoltage = parseFloat(threshold.highVoltage) || 0;
        const openBattery = parseFloat(threshold.openBattery) || 0;

        const cellDetails = cellData.map((cell, index) => ({
          cellNumber: index + 1,
          cellVoltage: cell.cellVoltage,
          cellTemperature: cell.cellTemperature,
        }));

        const cellVoltageLow = cellDetails.filter(cell => cell.cellVoltage < lowVoltage && cell.cellVoltage > aboutToDieVoltage && cell.cellVoltage > openBattery);
        const cellNotComm = cellDetails.filter(cell => cell.cellVoltage === 65.535 && cell.cellTemperature === 65535);
        const cellVoltageHigh = cellDetails.filter(cell => cell.cellVoltage > highVoltage);
        const cellVoltageAboutToDie = cellDetails.filter(cell => cell.cellVoltage <= aboutToDieVoltage && cell.cellVoltage > openBattery);
        const cellVoltageOpenBattery = cellDetails.filter(cell => cell.cellVoltage <= openBattery);

        return {
          serverTime: item.generalDataDTO?.serverTime || "N/A",
          siteId: item.siteId || "N/A",
          serialNumber: item.generalDataDTO?.deviceDataDTO?.[0]?.serialNumber || "N/A",
          stringVoltage: item.generalDataDTO?.deviceDataDTO?.[0]?.stringVoltage || "N/A",
          instantaneousCurrent: item.generalDataDTO?.deviceDataDTO?.[0]?.instantaneousCurrent || "N/A",
          ambientTemperature: item.generalDataDTO?.deviceDataDTO?.[0]?.ambientTemperature || "N/A",
          socLatestValueForEveryCycle: item.generalDataDTO?.deviceDataDTO?.[0]?.socLatestValueForEveryCycle || "N/A",
          dodLatestValueForEveryCycle: item.generalDataDTO?.deviceDataDTO?.[0]?.dodLatestValueForEveryCycle || "N/A",
          acVoltage: item.generalDataDTO?.chargerMonitoringDTO?.[0]?.acVoltage || "N/A",
          cellVoltageLow: cellVoltageLow.length > 0 ? cellVoltageLow : "No low voltage cells",
          cellVoltageHigh: cellVoltageHigh.length > 0 ? cellVoltageHigh : "No high voltage cells",
          cellVoltageAboutToDie: cellVoltageAboutToDie.length > 0 ? cellVoltageAboutToDie : "No about to die cells",
          cellVoltageOpenBattery: cellVoltageOpenBattery.length > 0 ? cellVoltageOpenBattery : "No open battery cells",
          cellNotComm: cellNotComm.length > 0 ? cellNotComm : "No non-communicating cells",
        };
      });

      console.log(`${alarmType} - Count: ${count}, Details:`, details);
      return { name: alarmType, count, details };
    };

    try {
      const response = await fetchCommunicationStatus(marginMinutes);
      console.log("API Response for Pie Click:", response);

      if (!response || !Array.isArray(response)) {
        console.error("Invalid API response:", response);
        setBarChartData([]);
        return;
      }

      let filteredData;
      let chartData = [];

      switch (data.name) {
        case 'Most Critical Alarm':
          filteredData = filterData(response, (bmsAlarms, chargerMonitoring, threshold, cellData) => {
            const batteryAboutToDieThreshold = parseFloat(threshold.batteryAboutToDie) || 0;
            const openBatteryThreshold = parseFloat(threshold.openBattery) || 0;
            const lowVoltageThreshold = parseFloat(threshold.lowVoltage) || 0;

            const isBatteryAboutToDie = cellData.some(cell =>
              cell.cellVoltage <= batteryAboutToDieThreshold &&
              cell.cellVoltage > openBatteryThreshold &&
              cell.cellVoltage < lowVoltageThreshold
            );
            const isOpenBattery = cellData.some(cell => cell.cellVoltage <= openBatteryThreshold);
            const isCellVoltageLow = bmsAlarms.cellVoltageLN === true && cellData.some(cell => cell.cellVoltage === lowVoltageThreshold);

            return (
              bmsAlarms.stringVoltageLNH === 0 || isCellVoltageLow || bmsAlarms.socLN === true ||
              isOpenBattery || isBatteryAboutToDie || chargerMonitoring.chargerTrip === true
            );
          });

          chartData = [
            generateChartData(filteredData, "String(V) Low", item => item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.stringVoltageLNH === 0),
            generateChartData(filteredData, "Cell(V) Low", item => {
              const lowVoltageThreshold = parseFloat(item?.siteLocationDTO?.manufacturerDTO?.lowVoltage) || 0;
              return item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.cellVoltageLN === true &&
                item?.generalDataDTO?.deviceDataDTO?.[0]?.cellVoltageTemperatureData?.some(cell => cell.cellVoltage === lowVoltageThreshold);
            }),
            generateChartData(filteredData, "SOC Low", item => item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.socLN === true),
            generateChartData(filteredData, "Battery Open", item => {
              const openBatteryThreshold = parseFloat(item?.siteLocationDTO?.manufacturerDTO?.openBattery) || 0;
              return item?.generalDataDTO?.deviceDataDTO?.[0]?.cellVoltageTemperatureData?.some(cell => cell.cellVoltage <= openBatteryThreshold);
            }),
            generateChartData(filteredData, "Battery AboutToDie", item => {
              const batteryAboutToDieThreshold = parseFloat(item?.siteLocationDTO?.manufacturerDTO?.batteryAboutToDie) || 0;
              const openBatteryThreshold = parseFloat(item?.siteLocationDTO?.manufacturerDTO?.openBattery) || 0;
              const lowVoltageThreshold = parseFloat(item?.siteLocationDTO?.manufacturerDTO?.lowVoltage) || 0;
              return item?.generalDataDTO?.deviceDataDTO?.[0]?.cellVoltageTemperatureData?.some(cell =>
                cell.cellVoltage <= batteryAboutToDieThreshold &&
                cell.cellVoltage > openBatteryThreshold &&
                cell.cellVoltage < lowVoltageThreshold
              );
            }),
            generateChartData(filteredData, "Charger Trip", item => item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.chargerTrip === true),
          ];
          break;

        case 'Critical Alarm':
          filteredData = filterData(response, (bmsAlarms, chargerMonitoring) => (
            bmsAlarms.stringVoltageLNH === 2 || bmsAlarms.cellVoltageNH === true ||
            bmsAlarms.stringCurrentHN === true || chargerMonitoring.inputMains === true ||
            chargerMonitoring.inputPhase === true || chargerMonitoring.rectifierFuse === true ||
            chargerMonitoring.filterFuse === true || chargerMonitoring.outputMccb === true ||
            chargerMonitoring.inputFuse === true || chargerMonitoring.batteryCondition === true ||
            chargerMonitoring.acVoltageULN === 2
          ));

          chartData = [
            generateChartData(filteredData, "String(V) High", item => item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.stringVoltageLNH === 2),
            generateChartData(filteredData, "Cell(V) High", item => item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.cellVoltageNH === true),
            generateChartData(filteredData, "String(A) High", item => item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.stringCurrentHN === true),
            generateChartData(filteredData, "Input Mains Fail", item => item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.inputMains === true),
            generateChartData(filteredData, "Input Phase Fail", item => item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.inputPhase === true),
            generateChartData(filteredData, "Rectifier Fuse Fail", item => item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.rectifierFuse === true),
            generateChartData(filteredData, "Filter Fuse Fail", item => item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.filterFuse === true),
            generateChartData(filteredData, "Output MCCB Fail", item => item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.outputMccb === true),
            generateChartData(filteredData, "Input Fuse Fail", item => item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.inputFuse === true),
            generateChartData(filteredData, "Battery Condition", item => item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.batteryCondition === true),
            generateChartData(filteredData, "AC(V) High", item => item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.acVoltageULN === 2),
          ];
          break;

        case 'Major Alarm':
          filteredData = filterData(response, (bmsAlarms, chargerMonitoring) => (
            bmsAlarms.ambientTemperatureHN === true || bmsAlarms.cellCommunication === true ||
            chargerMonitoring.dcVoltageOLN === 2 || chargerMonitoring.dcVoltageOLN === 0 ||
            chargerMonitoring.acVoltageULN === 0 || chargerMonitoring.outputFuse === true
          ));

          chartData = [
            generateChartData(filteredData, "Ambient (°C) High", item => item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.ambientTemperatureHN === true),
            generateChartData(filteredData, "Cell Comm Fail", item => item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.cellCommunication === true),
            generateChartData(filteredData, "DC Over Voltage", item => item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.dcVoltageOLN === 2),
            generateChartData(filteredData, "DC Under Voltage", item => item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.dcVoltageOLN === 0),
            generateChartData(filteredData, "AC Under Voltage", item => item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.acVoltageULN === 0),
            generateChartData(filteredData, "Output Fuse Fail", item => item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.outputFuse === true),
          ];
          break;

        case 'Minor Alarm':
          filteredData = filterData(response, (bmsAlarms, chargerMonitoring) => (
            bmsAlarms.bankDischargeCycle === true || bmsAlarms.bmsSedCommunication === true ||
            bmsAlarms.cellTemperatureHN === true || bmsAlarms.buzzer === true ||
            chargerMonitoring.chargerLoad === true || chargerMonitoring.alarmSupplyFuse === true ||
            chargerMonitoring.testPushButton === true || chargerMonitoring.resetPushButton === true
          ));

          chartData = [
            generateChartData(filteredData, "Battery Bank(Discharging)", item => item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.bankDischargeCycle === true),
            generateChartData(filteredData, "String Commu", item => item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.bmsSedCommunication === true),
            generateChartData(filteredData, "Buzzer Alarm", item => item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.buzzer === true),
            generateChartData(filteredData, "Cell Temperature", item => item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.cellTemperatureHN === true),
            generateChartData(filteredData, "Charger Load", item => item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.chargerLoad === true),
            generateChartData(filteredData, "Alarm Supply Fuse Fail", item => item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.alarmSupplyFuse === true),
            generateChartData(filteredData, "Test Push Button", item => item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.testPushButton === true),
            generateChartData(filteredData, "Reset Push Button", item => item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.resetPushButton === true),
          ];
          break;

        default:
          console.warn("Unknown status selected:", data.name);
          setBarChartData([]);
          return;
      }

      console.log("Filtered Data:", filteredData);
      console.log("Chart Data:", chartData);
      setBarChartData(chartData);
    } catch (error) {
      console.error("Error fetching communication status:", error);
      setBarChartData([]);
    }
  };

  const handlePieClickCommu = async (data) => {
    setSelectedCategory(data.name);
    setOpenDialog(true);

    setColumns([
      { field: 'siteId', headerName: 'Site ID' },
      { field: 'statusType', headerName: 'Status' },
      { field: 'vendor', headerName: 'Vendor' },
      { field: 'location', headerName: 'Location' },
      { field: 'stringVoltage', headerName: 'String Voltage' },
      { field: 'instantaneousCurrent', headerName: 'Instantaneous Current' },
      { field: 'ambientTemperature', headerName: 'Ambient Temperature' },
      { field: 'batteryRunHours', headerName: 'Battery Run Hours' },
    ]);

    try {
      const response = await fetchCommunicationStatus(marginMinutes);
      let filteredData = [];

      switch (data.name) {
        case 'Communicating':
          filteredData = response.filter(item => item.statusType === 1);
          break;
        case 'Non-Communicating':
          filteredData = response.filter(item => item.statusType === 0);
          break;
        default:
          filteredData = [];
      }

      const newRows = filteredData.map((item) => ({
        siteId: item?.siteId || '--',
        statusType: item?.statusType === 1 ? 'Communicating' : 'Non-Communicating',
        vendor: item?.siteLocationDTO?.vendorName || '--',
        location: item?.siteLocationDTO?.area || '--',
        stringVoltage: item?.generalDataDTO?.deviceDataDTO?.[0]?.stringVoltage || 0,
        instantaneousCurrent: item?.generalDataDTO?.deviceDataDTO?.[0]?.instantaneousCurrent || 0,
        ambientTemperature: item?.generalDataDTO?.deviceDataDTO?.[0]?.ambientTemperature || 0,
        batteryRunHours: item?.generalDataDTO?.deviceDataDTO?.[0]?.batteryRunHours || 0,
      }));

      setRows(newRows);
    } catch (error) {
      console.error("Error fetching data:", error);
      setRows([]);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStatus(null);
    setSelectedCategory(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSearch = (newSiteId) => {
    setSiteId(newSiteId);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const COLORS = ['#28a745', '#f39c12', '#17a2b8', '#6c757d', '#007bff', '#d9534f'];

  return (
    <Box className="dashboard-container" sx={{ padding: 1, boxShadow: '0px 0px 10px rgba(0,0,0,0.1)' }}>
      <DashBoardBar onSearch={handleSearch} mapMarkers={mapMarkers} setMapMarkers={setMapMarkers} />
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <MapComponent mapMarkers={mapMarkers} selectedStatus={selectedStatus} />
        </Grid>
        <Grid item xs={12} md={5}>
          <Grid container spacing={1} direction="column" alignItems="center">
            <Grid item>
              <PieChartComponent2 data1={data1} handlePieClick={handlePieClickCommu} />
            </Grid>
            <Grid item>
              <PieChartComponent data2={data2} handlePieClick={handlePieClick} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <DataDialog
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
        selectedStatus={selectedStatus}
        barChartData={barChartData}
        columns={columns}
        rows={rows}
        page={page}
        rowsPerPage={rowsPerPage}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default Dashboard;