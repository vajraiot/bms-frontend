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
  const [totalData,setTotalData]=useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchCommunicationStatus(marginMinutes);

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
          const isLowVoltageConditionMet = cellVoltageData.some(cell => cell.cellVoltage <= lowVoltageThreshold  &&cell.cellVoltage > batteryAboutToDieThreshold );

          // Most Critical Alarms
          if (isBatteryAboutToDie) mostCriticalCount++;
          if (isOpenBattery) mostCriticalCount++;
          if (bmsAlarms.stringVoltageLNH === 0) mostCriticalCount++;
          if (bmsAlarms.cellVoltageLN === true && isLowVoltageConditionMet) mostCriticalCount++;
          if (bmsAlarms.socLN === true) mostCriticalCount++;
          if (chargerMonitoring.chargerTrip === true) mostCriticalCount++;

          // Critical Alarms
          if (bmsAlarms.stringVoltageLNH === 2) criticalCount++;
          if (bmsAlarms.cellVoltageNH === true) criticalCount++;
          if (bmsAlarms.stringCurrentHN === true) criticalCount++;
          if (chargerMonitoring.inputMains === true) criticalCount++;
          if (chargerMonitoring.inputPhase === true) criticalCount++;
          if (chargerMonitoring.rectifierFuse === true) criticalCount++;
          if (chargerMonitoring.filterFuse === true) criticalCount++;
          if (chargerMonitoring.outputMccb === true) criticalCount++;
          if (chargerMonitoring.batteryCondition === true) criticalCount++;
          if (chargerMonitoring.inputFuse === true) criticalCount++;
          if (chargerMonitoring.acVoltageULN === 2) criticalCount++;

          // Major Alarms
          if (bmsAlarms.ambientTemperatureHN === true) majorCount++;
          if (bmsAlarms.cellCommunication === true) majorCount++;
          if (chargerMonitoring.dcVoltageOLN === 2) majorCount++;
          if (chargerMonitoring.dcVoltageOLN === 0) majorCount++;
          if (chargerMonitoring.acVoltageULN === 0) majorCount++;
          if (chargerMonitoring.outputFuse === true) majorCount++;

          // Minor Alarms
          if (bmsAlarms.bankDischargeCycle === true) minorCount++;
          if (bmsAlarms.bmsSedCommunication === true) minorCount++;
          if (bmsAlarms.cellTemperatureHN === true) minorCount++;
          if (bmsAlarms.buzzer === true) minorCount++;
          if (chargerMonitoring.chargerLoad === true) minorCount++;
          if (chargerMonitoring.alarmSupplyFuse === true) minorCount++;
          if (chargerMonitoring.testPushButton === true) minorCount++;
          if (chargerMonitoring.resetPushButton === true) minorCount++;

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
        setTotalData(response)
        setMapMarkers(markers);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [marginMinutes, setMapMarkers]);

  const handlePieClick =  (data) => {
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
        const temperature =parseFloat(threshold.highTemperature||0)
        const lowVoltage = parseFloat(threshold.lowVoltage) || 0;
        const highVoltage = parseFloat(threshold.highVoltage) || 0;
        const openBattery = parseFloat(threshold.openBattery) || 0;

        const cellDetails = cellData.map((cell, index) => ({
          cellNumber: index + 1,
          cellVoltage: cell.cellVoltage,
          cellTemperature: cell.cellTemperature,
        }));

        const cellVoltageLow = cellDetails.filter(cell => cell.cellVoltage <= lowVoltage && cell.cellVoltage > aboutToDieVoltage);
        const cellNotComm = cellDetails.filter(cell => cell.cellVoltage === 65.535 && cell.cellTemperature === 65535);
        const cellVoltageHigh = cellDetails.filter(cell => cell.cellVoltage > highVoltage);
        const cellTemperatureHigh = cellDetails.filter(cell => cell.cellTemperature > temperature);
        const cellVoltageAboutToDie = cellDetails.filter(cell => cell.cellVoltage <= aboutToDieVoltage && cell.cellVoltage > openBattery && cell.cellVoltage< lowVoltage);
        const cellVoltageOpenBattery = cellDetails.filter(cell => cell.cellVoltage <= openBattery &&cell.cellVoltage < aboutToDieVoltage );

        return {
          serverTime: item.generalDataDTO?.serverTime || "N/A",
          siteId: item.siteId || "N/A",
          serialNumber: item.generalDataDTO?.deviceDataDTO?.[0]?.serialNumber || "N/A",
          stringvoltage: item.generalDataDTO?.deviceDataDTO?.[0]?.stringvoltage || "N/A",
          instantaneousCurrent: item.generalDataDTO?.deviceDataDTO?.[0]?.instantaneousCurrent || "N/A",
          ambientTemperature: item.generalDataDTO?.deviceDataDTO?.[0]?.ambientTemperature || "N/A",
          socLatestValueForEveryCycle: item.generalDataDTO?.deviceDataDTO?.[0]?.socLatestValueForEveryCycle || "N/A",
          dodLatestValueForEveryCycle: item.generalDataDTO?.deviceDataDTO?.[0]?.dodLatestValueForEveryCycle || "N/A",
          acVoltage: item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.acVoltage || "N/A",
          inputMains: item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.inputMains || "N/A",
          batteryCondition: item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.batteryCondition || "N/A",
          chargerTrip: item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.chargerTrip || "N/A",
          inputPhase: item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.inputPhase || "N/A",
          rectifierFuse: item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.rectifierFuse || "N/A",
          filterFuse: item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.filterFuse || "N/A",
          outputFuse: item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.outputFuse || "N/A",
          outputMccb: item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.outputMccb || "N/A",
          chargerLoad: item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.chargerLoad || "N/A",
          inputFuse: item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.inputFuse || "N/A",
          alarmSupplyFuse: item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.alarmSupplyFuse || "N/A",
          testPushButton: item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.testPushButton || "N/A",
          resetPushButton: item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.resetPushButton || "N/A",
          cellVoltage: cellData[0]?.cellVoltage || "N/A",
          cellTemperature: cellData[0]?.cellTemperature || "N/A",
          bankDischargeCycle: item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.bankDischargeCycle || "N/A",
          bmsSedCommunication: item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.bmsSedCommunication || "N/A",
          cellCommunication: item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.cellCommunication || "N/A",
          buzzer: item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.buzzer || "N/A",
          cellVoltageLow: cellVoltageLow.length > 0 ? cellVoltageLow : "No low voltage cells",
          cellVoltageHigh: cellVoltageHigh.length > 0 ? cellVoltageHigh : "No high voltage cells",
          cellTemperatureHigh: cellTemperatureHigh.length > 0 ? cellTemperatureHigh : "No high Temperarture cells",
          cellVoltageAboutToDie: cellVoltageAboutToDie.length > 0 ? cellVoltageAboutToDie : "No about to die cells",
          cellVoltageOpenBattery: cellVoltageOpenBattery.length > 0 ? cellVoltageOpenBattery : "No open battery cells",
          cellNotComm: cellNotComm.length > 0 ? cellNotComm : "No non-communicating cells",
        };
      });

      return { name: alarmType, count, details };
    };

    try {
      // const response = await fetchCommunicationStatus(marginMinutes);

      // if (!response || !Array.isArray(response)) {
      //   console.error("Invalid API response:", response);
      //   setBarChartData([]);
      //   return;
      // }

      let filteredData;
      let chartData = [];

      switch (data.name) {
        case 'Most Critical Alarm':
          filteredData = filterData(totalData, (bmsAlarms, chargerMonitoring, threshold, cellData) => {
            const batteryAboutToDieThreshold = parseFloat(threshold.batteryAboutToDie) || 0;
            const openBatteryThreshold = parseFloat(threshold.openBattery) || 0;
            const lowVoltageThreshold = parseFloat(threshold.lowVoltage) || 0;

            const isBatteryAboutToDie = cellData.some(cell =>
              cell.cellVoltage <= batteryAboutToDieThreshold &&
              cell.cellVoltage > openBatteryThreshold &&
              cell.cellVoltage < lowVoltageThreshold
            );
            const isOpenBattery = cellData.some(cell => cell.cellVoltage <= openBatteryThreshold);
            const isCellVoltageLow = bmsAlarms.cellVoltageLN === true && cellData.some(cell => cell.cellVoltage <= lowVoltageThreshold && cell.cellVoltage >batteryAboutToDieThreshold );

            return (
              isBatteryAboutToDie || isOpenBattery || bmsAlarms.stringVoltageLNH === 0 ||
              isCellVoltageLow || bmsAlarms.socLN === true || chargerMonitoring.chargerTrip === true
            );
          });

          chartData = [
            generateChartData(filteredData, "String(V) Low", item => item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.stringVoltageLNH === 0),
            generateChartData(filteredData, "Cell(V) Low", item => {
              const lowVoltageThreshold = parseFloat(item?.siteLocationDTO?.manufacturerDTO?.lowVoltage) || 0;
              const batteryAboutToDieThreshold = parseFloat(item?.siteLocationDTO?.manufacturerDTO?.batteryAboutToDie) || 0;
              return item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.cellVoltageLN === true &&
                item?.generalDataDTO?.deviceDataDTO?.[0]?.cellVoltageTemperatureData?.some(cell => cell.cellVoltage <= lowVoltageThreshold &&  cell.cellVoltage>batteryAboutToDieThreshold) ;
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
          filteredData = filterData(totalData, (bmsAlarms, chargerMonitoring) => (
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
          filteredData = filterData(totalData, (bmsAlarms, chargerMonitoring) => (
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
          filteredData = filterData(totalData, (bmsAlarms, chargerMonitoring) => (
            bmsAlarms.bankDischargeCycle === true || bmsAlarms.bmsSedCommunication === true ||
            bmsAlarms.cellTemperatureHN === true || bmsAlarms.buzzer === true ||
            chargerMonitoring.chargerLoad === true || chargerMonitoring.alarmSupplyFuse === true ||
            chargerMonitoring.testPushButton === true || chargerMonitoring.resetPushButton === true
          ));

          chartData = [
            generateChartData(filteredData, "Battery Bank(Discharging)", item => item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.bankDischargeCycle === true),
            generateChartData(filteredData, "String Commu", item => item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.bmsSedCommunication === true),
            generateChartData(filteredData, "Buzzer Alarm", item => item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.buzzer === true),
            
            generateChartData(filteredData, "Cell Temperature", item => {
              const cellTemperatureThreshold = parseFloat(item?.siteLocationDTO?.manufacturerDTO?.highTemperature) || 0;
              return (
                item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.cellTemperatureHN === true &&
                item?.generalDataDTO?.deviceDataDTO?.[0]?.cellVoltageTemperatureData?.some(cell => cell.cellTemperature >= cellTemperatureThreshold)
              );
            }),
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
      setBarChartData(chartData);
    } catch (error) {
      console.error("Error fetching communication status:", error);
      setBarChartData([]);
    }
  };

  const handlePieClickCommu = (data) => {
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
     // const response = await fetchCommunicationStatus(marginMinutes);
      let filteredData = [];

      switch (data.name) {
        case 'Communicating':
          filteredData = totalData.filter(item => item.statusType === 1);
          break;
        case 'Non-Communicating':
          filteredData = totalData.filter(item => item.statusType === 0);
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