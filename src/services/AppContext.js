import React, { createContext, useState, useEffect, useContext } from "react";
import { fetchAllSiteIds, fetchDeviceDetails, fetchManufacturerDetails,  fetchHistoricalBatteryandChargerdetails,  fetchDaywiseBatteryandChargerdetails,
  fetchAlarmsBatteryandChargerdetails, } from "./apiService";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [siteOptions, setSiteOptions] = useState([]); // Options for site IDs
  const [serialNumberOptions, setSerialNumberOptions] = useState([]); // Serial number options for the selected site
  const [siteId, setSiteId] = useState(""); // Selected Site ID
  const [serialNumber, setSerialNumber] = useState(""); // Selected Serial Number
  const [data, setData] = useState([]); // Generic state for device data
  const [Mdata, setMdata] = useState(null); // Manufacturer details
  const[location,setLocation]=useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [charger,setCharger]=useState(null);
  const [liveTime,setLiveTime]=useState(null);
  const [mapMarkers, setMapMarkers] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [username, setUsername] = useState("");
  const [marginMinutes, setMarginMinutes] = useState(15);
  const [page, setPage]=useState(0);
  const[rowsPerPage, setRowsPerPage]=useState(20);
 const [totalRecords, setTotalRecords] = useState(0);
  // Fetch site options on load
  useEffect(() => {
    
    const fetchOptions = async () => {
      try {
        const data = await fetchAllSiteIds();
        setSiteOptions(data);
      } catch (error) {
        console.error("Error fetching site options:", error);
      }
    };
    fetchOptions();
  }, []);

  const handleSiteIdChange = (selectedSiteId) => {
  
    setSiteId(selectedSiteId); // Update siteId
    setSerialNumber(""); // Clear previous serialNumber

    const selectedSite = siteOptions.find((site) => site.siteId === selectedSiteId);

    if (selectedSite) {
      // Populate Serial Number options dynamically
      setSerialNumberOptions(
        selectedSite.lstSerialNumberList.map((item) => item.serialNumber)
      );

    } else {
      setSerialNumberOptions([]); // Clear if no site matches
    }
  };
  const handleSearch = async () => {
    if (siteId && serialNumber) {
      try {
        // Clear previous data
        setMdata(null); // Clear previous manufacturer details
        setData([]);    // Clear previous device data
        setCharger([]); // Clear previous charger data
        setLocation(null);
        setLiveTime(null);
        // Fetch manufacturer details
        const manufacturerDetails = await fetchManufacturerDetails(siteId, serialNumber);
        const deviceResponse = await fetchDeviceDetails(siteId, serialNumber);
        const { chargerMonitoringDTO, deviceDataDTO, packetDateTime } = deviceResponse;
        if (deviceDataDTO.length>0) {
          setData(deviceDataDTO); // Store device data
          setMdata(manufacturerDetails);
          setLiveTime(packetDateTime);
        }
        if (deviceResponse && chargerMonitoringDTO) {
          // Handle device response if needed
          setCharger(chargerMonitoringDTO); // Store charger data
        }
        const selectedSite = siteOptions.find((site) => site.siteId === siteId);
        setLocation(selectedSite)
        // Return the fetched data for further usage
        return deviceResponse;
      } catch (error) {
        console.error("Error during search:", error);
      }
    } else {
      console.error("Please select both Site ID and Serial Number.");
    }
  };

  const handleLogout = () => {
    // Show confirmation dialog
    setIsAuthenticated(false); 
  };

  const [loadingReport, setLoadingReport] = useState(false);
  const [errors, setErrors] = useState({
    siteId: false,
    serialNumber: false,
    startDate: false,
    endDate: false,
  });

  const handleAnalytics = async (pageType) => {
    // Check for empty fields and update errors state
    const newErrors = {
      siteId: !siteId,
      serialNumber: !serialNumber,
      startDate: !startDate,
      endDate: !endDate,
    };
    setErrors(newErrors);

    // Stop execution if any field is empty
    if (!siteId || !serialNumber || !startDate || !endDate) {
      return;
    }

    try {
      setLoadingReport(true);
      setData([])

      let result;
      switch (pageType) {
        case "historical":
          result = await fetchHistoricalBatteryandChargerdetails(
            serialNumber,
            siteId,
            startDate,
            endDate,page,rowsPerPage
          );
          break;

        case "daywise":
          result = await fetchDaywiseBatteryandChargerdetails(
            serialNumber,
            siteId,
            startDate,
            endDate
          );
          break;

        case "alarms":
          result = await fetchAlarmsBatteryandChargerdetails(
            serialNumber,
            siteId,
            startDate,
            endDate
          );
          break;

        default:
          throw new Error("Invalid page type");
      }

      setData(result); // Update report data
      setTotalRecords(result.page.totalElements)
    } catch (error) {
      console.error("Error during search:", error);
    } finally {
      setLoadingReport(false);
    }
  };

  const contextValue = {
    siteOptions,handleSearch,
    serialNumberOptions,
    siteId,
    serialNumber,
    setSiteId: handleSiteIdChange,
    setSerialNumber,handleLogout,
    data,
    setData,
    Mdata,
    setMdata,
    location,setLocation,
    startDate,
    setStartDate,
    endDate,
    setEndDate,username, setUsername,
    year,
    setYear,handleAnalytics,
    month,userRole, setUserRole,marginMinutes, setMarginMinutes,
    setMonth,isAuthenticated, setIsAuthenticated,
    charger,setCharger,liveTime,setLiveTime,mapMarkers, setMapMarkers,
    page, setPage,rowsPerPage, setRowsPerPage,loadingReport,errors,totalRecords, setTotalRecords
  
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};
export 
const formatToTime = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};
 