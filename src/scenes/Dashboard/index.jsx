import React, { useState, useEffect, useContext } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { fetchCommunicationStatus } from "../../services/apiService";
import DataDialog from "./DataDialog"
import PieChartComponent2 from './PieChartComponent2';
import PieChartComponent from './PieChartComponent';
import MapComponent from './MapComponent';
import {Box,Grid,} from "@mui/material";
import "leaflet/dist/leaflet.css";
import DashBoardBar from "../Dashboard/DashBoardBar/DashBoardBar";
import { AppContext } from "../../services/AppContext";



const Dashboard = () => {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedcategory, setSelectedcategory] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { data = [],mapMarkers, setMapMarkers, marginMinutes} = useContext(AppContext);
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  // const [mapMarkers, setMapMarkers] = useState([]);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [siteId, setSiteId] = useState(''); 
  const [barChartData, setBarChartData] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch communication status data
        const data = await fetchCommunicationStatus(marginMinutes);
        console.log("Fetched Communication Data:", data);

        let communicatingCount = 0;
        let nonCommunicatingCount = 0;

        let MostCriticalCount = 0;
        let CriticalCount = 0;
        let MajorCount = 0;
        let MinorCount = 0;
        const markers = [];

        data.forEach((item) => {
          
          if (item.statusType === 1) communicatingCount++;
          else if (item.statusType === 0) nonCommunicatingCount++;

          const MostCriticalConditions = item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO;
          const ChargerMonitoringMostCritical = item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO;
          const Thresholdmostcritical = item?.siteLocationDTO?.manufacturerDTO;

          // Get the cell voltage data
          const cellVoltageData = item?.generalDataDTO?.deviceDataDTO?.[0]?.cellVoltageTemperatureData;

          // Parse thresholds
          const batteryAboutToDieThreshold = parseFloat(Thresholdmostcritical?.batteryAboutToDie);
          const openBatteryThreshold = parseFloat(Thresholdmostcritical?.openBattery);
          const lowVoltageThreshold = parseFloat(Thresholdmostcritical?.lowVoltage);

          // Check if the battery is "about to die" based on cell voltage
          if (cellVoltageData && !isNaN(batteryAboutToDieThreshold) && !isNaN(openBatteryThreshold) && !isNaN(lowVoltageThreshold)) {
              const isBatteryAboutToDie = cellVoltageData.some(cell => 
                  cell.cellVoltage <= batteryAboutToDieThreshold &&
                  cell.cellVoltage > openBatteryThreshold &&
                  cell.cellVoltage < lowVoltageThreshold
              );

              if (isBatteryAboutToDie) {
                  MostCriticalCount++; // Increment if any cell voltage meets the "about to die" condition
              }
          }

          // Check if the battery is "open" based on cell voltage
          if (cellVoltageData && !isNaN(openBatteryThreshold)) {
              const isOpenBattery = cellVoltageData.some(cell => cell.cellVoltage <= openBatteryThreshold);

              if (isOpenBattery) {
                  MostCriticalCount++; // Increment if any cell voltage meets the "open battery" condition
              }
          }

          if (MostCriticalConditions || ChargerMonitoringMostCritical) {
              if (MostCriticalConditions?.stringVoltageLNH === 0) MostCriticalCount++;      // String Voltage Low
              if (MostCriticalConditions?.cellVoltageLN === true) MostCriticalCount++;     // Cell Voltage Low
              if (MostCriticalConditions?.socLN === true) MostCriticalCount++;            // SOC Low
              if (ChargerMonitoringMostCritical?.chargerTrip === true) MostCriticalCount++; // Charger Trip
          }
          console.log(MostCriticalCount);

          const CriticalConditions = item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO;
          const ChargerMonitoringCritical = item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO;
          
          if (CriticalConditions || ChargerMonitoringCritical) {
            if (CriticalConditions?.stringVoltageLNH === 2) CriticalCount++;              // String Voltage High
            if (CriticalConditions?.cellVoltageNH === true) CriticalCount++;                // Cell Voltage High
            if (CriticalConditions?.stringCurrentHN === true) CriticalCount++;            // String Current High
            if (ChargerMonitoringCritical?.inputMains === true) CriticalCount++;          // Input Mains Failure
            if (ChargerMonitoringCritical?.inputPhase === true) CriticalCount++;          // Input Phase Failure
            if (ChargerMonitoringCritical?.rectifierFuse === true) CriticalCount++;       // Rectifier Fuse Failure
            if (ChargerMonitoringCritical?.filterFuse === true) CriticalCount++;          // Filter Fuse Failure
            if (ChargerMonitoringCritical?.outputMccb === true) CriticalCount++;          // Output MCCB Failure
            if (ChargerMonitoringCritical?.batteryCondition === true) CriticalCount++;    // Battery Condition Failure
            if (ChargerMonitoringCritical?.inputFuse === true) CriticalCount++;           // Input Fuse Failure
            if (ChargerMonitoringCritical?.acVoltageULN === 2) CriticalCount++;           // AC Voltage Abnormal
          }
          
          console.log(CriticalCount);
          

          const MajorConditions = item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO;
          const ChargerMonitoring = item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO;
          
          if (MajorConditions || ChargerMonitoring) {
            if (MajorConditions?.ambientTemperatureHN === true) MajorCount++;  // Ambient Temperature High
            if (MajorConditions?.cellCommunication === true) MajorCount++;     // Cell Communication Failure
            if (ChargerMonitoring?.dcVoltageOLN === 2) MajorCount++;           // DC Over Voltage Detection
            if (ChargerMonitoring?.dcVoltageOLN === 0) MajorCount++;           // DC Under Voltage Detection
            if (ChargerMonitoring?.acVoltageULN === 0) MajorCount++;           // AC Under Voltage Detection
            if (ChargerMonitoring?.outputFuse === true) MajorCount++;          // Output Fuses Failure Detection
          }
   
          const MinorConditions = item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO;
          const ChargerMonitoringMinor = item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO;
          
          if (MinorConditions || ChargerMonitoringMinor) {
            if (MinorConditions?.bankDischargeCycle === true) MinorCount++;      // Battery Status (Discharging)
            if (MinorConditions?.bmsSedCommunication === true) MinorCount++; // String Communication
            if (MinorConditions?.cellTemperatureHN === true) MinorCount++;   // Cell Temperature High
            if (MinorConditions?.buzzer === true) MinorCount++;              // Buzzer Alarm
            if (ChargerMonitoringMinor?.chargerLoad === true) MinorCount++;  // Charger Load Detection
            if (ChargerMonitoringMinor?.alarmSupplyFuse === true) MinorCount++;
            if (ChargerMonitoringMinor?.testPushButton === true) MinorCount++;
            if (ChargerMonitoringMinor?.resetPushButton === true) MinorCount++; 
          }

          // Add marker data for map
          if (item.siteLocationDTO) {
            const { latitude, longitude, area, vendorName, siteId } = item.siteLocationDTO;
            if (latitude && longitude) {
                let serialNumber = null;

                // Check if deviceDataDTO exists and is an array
                if (item.generalDataDTO && item.generalDataDTO.deviceDataDTO && item.generalDataDTO.deviceDataDTO.length > 0) {
                    serialNumber = item.generalDataDTO.deviceDataDTO[0].serialNumber; // Get the first device's serial number
                }

                markers.push({
                    lat: latitude,
                    lng: longitude,
                    name: area || "Unnamed Site",
                    vendor: vendorName,
                    statusType: item.statusType,
                    siteId: siteId,
                    serialNumber: serialNumber || "N/A" // Default to "N/A" if no serial number is found
                });
            }
          }

          console.log("Marker Data:", markers);
        });

        // Set the transformed data for the first set of stats
        setData1([
          { name: "Communicating", value: communicatingCount },
          { name: "Non-Communicating", value: nonCommunicatingCount },
        ]);

        // Set the transformed data for the second set of stats
        setData2([
          { name: "Most Critical Alarm", value: MostCriticalCount },
          { name: "Critical Alarm", value: CriticalCount },
          { name: "Major Alarm", value: MajorCount },
          { name: "Minor Alarm", value: MinorCount },
        ]);

        // Update map markers
        setMapMarkers(markers);
      

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [marginMinutes]); 

  const handlePieClick = async (data) => {
    // Set the selected status and open the dialog
    setSelectedStatus(data.name);
    setOpenDialog(true);
  
    // Initialize alarm counts
    // const alarmCounts = {
    //   stringVoltageLNH: 0,
    //   cellVoltageLN: 0,
    //   cellVoltageNH: 0,
    //   socLN: 0,
    //   batteryCondition: 0,
    //   chargerTrip: 0,

    //   stringCurrentHN: 0,
    //   inputMains: 0,
    //   inputPhase: 0,
    //   rectifierFuse: 0,
    //   filterFuse: 0,
    //   outputMccb: 0,
    //   inputFuse: 0,
    //   acVoltageULN: 0,
    //   ambientTemperatureHN: 0,
    //   cellCommunication: 0,
    //   dcVoltageOLN: 0,
    //   acVoltageOLN: 0,
    //   buzzer: 0,
    //   chargerLoad: 0,
    //   alarmSupplyFuse: 0,
    //   testPushButton: 0,
    //   resetPushButton: 0,
    // };
  
    // Helper function to filter data based on conditions
    const filterData = (response, conditions) => {
      return response.filter((item) => {
        const bmsAlarms = item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO;
        const chargerMonitoring = item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO || {};
        const Threshold = item?.siteLocationDTO?.manufacturerDTO||{};
        const cellVoltageTemperatureData=item?.generalDataDTO?.deviceDataDTO?.[0]?.cellVoltageTemperatureData;
        return conditions(bmsAlarms, chargerMonitoring,Threshold,cellVoltageTemperatureData);
      });
    };
  
    // Helper function to generate chart data
    const generateChartData = (filteredData, alarmType, condition) => {
      const count = filteredData.filter((item) => condition(item)).length;
      const details = filteredData
        .filter((item) => condition(item))
        .map((item) => ({
          serverTime:item.generalDataDTO?.serverTime,
          siteId: item.siteId,
          serialNumber: item.generalDataDTO?.deviceDataDTO?.[0]?.serialNumber || "N/A", 
          stringvoltage: item.generalDataDTO?.deviceDataDTO?.[0]?.stringvoltage || "N/A",
          instantaneousCurrent:item.generalDataDTO?.deviceDataDTO?.[0]?.instantaneousCurrent,
          ambientTemperature:item.generalDataDTO?.deviceDataDTO?.[0]?.ambientTemperature,
          socLatestValueForEveryCycle:item.generalDataDTO?.deviceDataDTO?.[0]?.socLatestValueForEveryCycle,
          dodLatestValueForEveryCycle:item.generalDataDTO?.deviceDataDTO?.[0]?.dodLatestValueForEveryCycle,
          acVoltage:item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.acVoltage,
          inputMains:item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.inputMains,
          batteryCondition:item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.batteryCondition,
          chargerTrip:item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.chargerTrip,
          inputPhase:item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.inputPhase,
          rectifierFuse:item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.rectifierFuse,
          filterFuse:item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.filterFuse,
          outputFuse:item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.outputFuse,
          // dcVoltageOLN:item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.,
          outputMccb:item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.outputMccb,
          chargerLoad:item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.chargerLoad,
          inputFuse:item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.inputFuse,
          alarmSupplyFuse:item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.alarmSupplyFuse,
          testPushButton:item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.testPushButton,
          resetPushButton:item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.resetPushButton,
          cellVoltage:item?.generalDataDTO?.deviceDataDTO?.[0]?.cellVoltageTemperatureData?.[0]?.cellVoltage,
          cellTemperature:item?.generalDataDTO?.deviceDataDTO?.[0]?.cellVoltageTemperatureData?.[0]?.cellTemperature,
          // cellVoltageNH:item?.generalDataDTO?.deviceDataDTO?.[0]?.cellVoltageTemperatureData?.cellVoltage,
          bankDischargeCycle:item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.bankDischargeCycle ,
          bmsSedCommunication:item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.bmsSedCommunication ,
          cellCommunication:item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.cellCommunication ,
          buzzer:item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.buzzer ,
          // openBattery:item?.generalDataDTO?.deviceDataDTO?.[0]?.cellVoltageTemperatureData?.cellVoltage,
          // batteryAboutToDie:item?.generalDataDTO?.deviceDataDTO?.[0]?.cellVoltageTemperatureData?.cellVoltage

        }));
      console.log("item", filteredData);
      return { name: alarmType, count, details };
    };
    try {
      const response = await fetchCommunicationStatus(marginMinutes);
      let filteredData;
      let chartData = [];
  
      // Define conditions and chart data generation logic for each case
      switch (data.name) {
        case 'Most Critical Alarm':
        filteredData = filterData(response, (bmsAlarms, chargerMonitoring, Threshold, cellVoltageTemperatureData) => {
          const batteryAboutToDieThreshold = parseFloat(Threshold?.batteryAboutToDie);
          const openBatteryThreshold = parseFloat(Threshold?.openBattery);
          const lowVoltageThreshold = parseFloat(Threshold?.lowVoltage);

          // Check "about to die" condition
          const isBatteryAboutToDie = cellVoltageTemperatureData?.some(cell =>
            cell.cellVoltage <= batteryAboutToDieThreshold &&
            cell.cellVoltage > openBatteryThreshold &&
            cell.cellVoltage < lowVoltageThreshold
          );

          // Check "open battery" condition
          const isOpenBattery = cellVoltageTemperatureData?.some(cell =>
            cell.cellVoltage <= openBatteryThreshold
          );

          return (
            bmsAlarms?.stringVoltageLNH === 0 || // String Voltage Low
            bmsAlarms?.cellVoltageLN === true || // Cell Voltage Low
            bmsAlarms?.socLN === true || // SOC Low
            isOpenBattery || // Open Battery
            isBatteryAboutToDie || // Battery About to Die
            chargerMonitoring?.chargerTrip === true // Charger Trip
          );
        });

        chartData = [
          generateChartData(filteredData, "String(V) Low", (item) => item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.stringVoltageLNH === 0),
          generateChartData(filteredData, "Cell(V) Low", (item) => item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.cellVoltageLN === true),
          generateChartData(filteredData, "SOC Low", (item) => item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.socLN === true),
          generateChartData(filteredData, "Battery Open", (item) => {
            const openBatteryThreshold = parseFloat(item?.siteLocationDTO?.manufacturerDTO?.openBattery);
            return item?.generalDataDTO?.deviceDataDTO?.[0]?.cellVoltageTemperatureData?.some(cell =>
              cell.cellVoltage <= openBatteryThreshold
            );
          }),
          generateChartData(filteredData, "Battery AboutToDie", (item) => {
            const batteryAboutToDieThreshold = parseFloat(item?.siteLocationDTO?.manufacturerDTO?.batteryAboutToDie);
            const openBatteryThreshold = parseFloat(item?.siteLocationDTO?.manufacturerDTO?.openBattery);
            const lowVoltageThreshold = parseFloat(item?.siteLocationDTO?.manufacturerDTO?.lowVoltage);
            return item?.generalDataDTO?.deviceDataDTO?.[0]?.cellVoltageTemperatureData?.some(cell =>
              cell.cellVoltage <= batteryAboutToDieThreshold &&
              cell.cellVoltage > openBatteryThreshold &&
              cell.cellVoltage < lowVoltageThreshold
            );
          }),
          generateChartData(filteredData, "Charger Trip", (item) => item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.chargerTrip === true),
        ];
        break;
  
        case 'Critical Alarm':
          filteredData = filterData(response, (bmsAlarms, chargerMonitoring) => (
            bmsAlarms?.stringVoltageLNH === 2 || // String Voltage High
            bmsAlarms?.cellVoltageNH === true|| // Cell Voltage High
            bmsAlarms?.stringCurrentHN === true || // String Current High
            chargerMonitoring?.inputMains === true || // Input Mains Failure
            chargerMonitoring?.inputPhase === true || // Input Phase Failure
            chargerMonitoring?.rectifierFuse === true || // Rectifier Fuse Failure
            chargerMonitoring?.filterFuse === true || // Filter Fuse Failure
            chargerMonitoring?.outputMccb === true || // Output MCCB Failure
            chargerMonitoring?.inputFuse === true ||
            chargerMonitoring?.batteryCondition === true|| // Input Fuse Failure
            chargerMonitoring?.acVoltageULN === 2
          ));
  
          chartData = [
            generateChartData(filteredData, "String(V) High", (item) => item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.stringVoltageLNH === 2),
            generateChartData(filteredData, "Cell(V) High", (item) => item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.cellVoltageNH === true),
            generateChartData(filteredData, "String(A) High", (item) => item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.stringCurrentHN === true),
            generateChartData(filteredData, "Input Mains Fail", (item) => item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.inputMains === true),
            generateChartData(filteredData, "Input Phase Fail", (item) => item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.inputPhase === true),
            generateChartData(filteredData, "Rectifier Fuse Fail", (item) => item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.rectifierFuse === true),
            generateChartData(filteredData, "Filter Fuse Fail", (item) => item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.filterFuse === true),
            generateChartData(filteredData, "Output MCCB Fail", (item) => item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.outputMccb === true),
            generateChartData(filteredData, "Input Fuse Fail", (item) => item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.inputFuse === true),
            generateChartData(filteredData, "Battery Condition", (item) => item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.batteryCondition === true),
            generateChartData(filteredData, "AC(V) High", (item) => item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.acVoltageULN === 2),
          
          ];
          break;
  
        case 'Major Alarm':
          filteredData = filterData(response, (bmsAlarms, chargerMonitoring) => (
            bmsAlarms?.ambientTemperatureHN === true || // Ambient Temperature High
            bmsAlarms?.cellCommunication === true || // Cell Communication Failure
            chargerMonitoring?.dcVoltageOLN === 2 || // DC Over Voltage Detection
            chargerMonitoring?.dcVoltageOLN === 0 || // DC Under Voltage Detection
            chargerMonitoring?.acVoltageULN === 0 || // AC Under Voltage Detection
            chargerMonitoring?.outputFuse === true // Output Fuse Failure
          ));
  
          chartData = [
            generateChartData(filteredData, "Ambient (°C) High", (item) => item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.ambientTemperatureHN === true),
            generateChartData(filteredData, "Cell Comm Fail", (item) => item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.cellCommunication === true),
            generateChartData(filteredData, "DC Over Voltage", (item) => item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.dcVoltageOLN === 2),
            generateChartData(filteredData, "DC Under Voltage", (item) => item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.dcVoltageOLN === 0),
            generateChartData(filteredData, "AC Under Voltage", (item) =>item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.acVoltageULN === 0),
            generateChartData(filteredData, "Output Fuse Fail", (item) =>item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.outputFuse === true),
          ];
          break;
  
        case 'Minor Alarm':
          filteredData = filterData(response, (bmsAlarms, chargerMonitoring) => (
            bmsAlarms?.bankDischargeCycle === true ||
            bmsAlarms?.bmsSedCommunication === true || // Battery Status (Discharging)
            bmsAlarms?.stringCommunication === true || // String Communication
            bmsAlarms?.cellTemperatureHN === true || // Cell Temperature High
            bmsAlarms?.buzzer === true || // Buzzer Alarm
            chargerMonitoring?.chargerLoad === true || // Charger Load Detection
            chargerMonitoring?.alarmSupplyFuse === true || // Alarm Supply Fuse Failure
            chargerMonitoring?.testPushButton === true || // Test Push Button Pressed
            chargerMonitoring?.resetPushButton === true // Reset Push Button Pressed
          ));
  
          chartData = [

            generateChartData(filteredData, "Battery Bank(Discharging)", (item) => item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.bankDischargeCycle === true),
            generateChartData(filteredData, "String Commu", (item) => item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.bmsSedCommunication === true),
            generateChartData(filteredData, "Buzzer Alarm", (item) => item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.buzzer === true),
            generateChartData(filteredData, "Cell Temperature", (item) => item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO?.cellTemperatureHN === true),
            generateChartData(filteredData, "Charger Load", (item) => item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.chargerLoad === true),
            generateChartData(filteredData, "Alarm Supply Fuse Fail", (item) => item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.alarmSupplyFuse === true),
            generateChartData(filteredData, "Test Push Button", (item) => item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.testPushButton === true),
            generateChartData(filteredData, "Reset Push Button", (item) => item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO?.resetPushButton === true),

          ];
          break;
  
        default:
          console.warn("Unknown status selected:", data.name);
          return;
      }
  
      // Update the bar chart with the generated data
      setBarChartData(chartData);
    } catch (error) {
      console.error("Error fetching communication status:", error);
    }
  };
  const handlePieClickCommu = (data) => { 
    // Set the selected status
    setSelectedcategory(data.name);
  
    // Open the dialog on pie chart slice click
    setOpenDialog(true);
  
    // Dynamically set columns for the dialog
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
  
    const fetchDataForStatus = async () => {
      try {
        const response = await fetchCommunicationStatus(marginMinutes);
        let filteredData = [];
  
        // Filter data based on the clicked slice (Communicating or Non-Communicating)
        switch (data.name) {
          case 'Communicating':
            filteredData = response.filter(item => item.statusType === 1); // statusType 1 = Communicating
            break;
          case 'Non-Communicating':
            filteredData = response.filter(item => item.statusType === 0); // statusType 0 = Non-Communicating
            break;
          default:
            filteredData = []; // No data for unknown status
        }
  
        // Map filtered data into table rows for dialog
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
  
        // Set rows for the table in the dialog
        setRows(newRows);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    // Call the function to fetch data
    fetchDataForStatus();
  };
  
  
  


  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStatus(null);
  };
  const handleOpenDialog = () => setOpenDialog(true);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleSearch = (newSiteId) => {
    setSiteId(newSiteId); // Update the siteId state when search is triggered
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when rows per page is changed
  };
  // Gradient colors for pie charts
  const COLORS = ['#28a745', '#f39c12', '#17a2b8', '#6c757d', '#007bff', '#d9534f'];

  return (
    <Box className="dashboard-container" sx={{ padding: 1 ,
        
      boxShadow: '0px 0px 10px rgba(0,0,0,0.1)'  }}>
       <DashBoardBar onSearch={handleSearch} mapMarkers={mapMarkers} setMapMarkers={setMapMarkers} />
      <Grid container spacing={3}>
        {/* Left Side - Map */}
        <Grid item xs={12} md={7}>
        <MapComponent mapMarkers={mapMarkers} selectedStatus={selectedStatus}/>
        </Grid>

        {/* Right Side - Pie Charts */}
        <Grid item xs={12} md={5}>
            <Grid container spacing={1} direction="column" alignItems="center" >
              {/* Communication Status Pie Chart */}
              <Grid item>
              <PieChartComponent2 data1={data1} handlePieClick={handlePieClickCommu} />
              </Grid>

              {/* BMS Alarms Pie Chart */}
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
      />

    </Box>
  );
};

export default Dashboard;
