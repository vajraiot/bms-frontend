import React, { createContext, useState, useEffect } from "react";
import { fetchAllSiteIds, fetchDeviceDetails, fetchManufacturerDetails,  fetchHistoricalBatteryandChargerdetails,  fetchDaywiseBatteryandChargerdetails,
  fetchAlarmsBatteryandChargerdetails, } from "./apiService";
import { useNavigate } from "react-router-dom"; 

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [siteOptions, setSiteOptions] = useState([]);
  const [serialNumberOptions, setSerialNumberOptions] = useState([]);
  const [siteId, setSiteId] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [data, setData] = useState([]);
  const [Mdata, setMdata] = useState(null);
  const [location, setLocation] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [charger, setCharger] = useState(null);
  const [liveTime, setLiveTime] = useState(null);
  const [mapMarkers, setMapMarkers] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [username, setUsername] = useState("");
  const [page, setPage]=useState(0);
  const[rowsPerPage, setRowsPerPage]=useState(50);
 const [totalRecords, setTotalRecords] = useState(0)
  const [marginMinutes, setMarginMinutes] = useState(15);
  const [token, setToken] = useState(sessionStorage.getItem("token") || "");
  const [loadingReport, setLoadingReport] = useState(false);
  const [errors, setErrors] = useState({
    siteId: false,
    serialNumber: false,
    startDate: false,
    endDate: false,
  });
  const[pageType,setPageType]=useState("")

const[dayDaywiseData,setDayWiseData]=useState([])
const[alarmsData,setAlarmsData]=useState([])
const[realTimeData,setrealTimeData]=useState([])
  useEffect(() => {
    const fetchOptions = async () => {
      if (!token) return; // Only fetch options if the token exists
      try {
        const data = await fetchAllSiteIds();
        setSiteOptions(data);
      } catch (error) {
        console.error("Error fetching site options:", error);
        if (error.response?.status === 401) {
          handleLogout();
        }
      }
    };
    fetchOptions();
  }, [token]); // Depend on token instead of isAuthenticated
  useEffect(() => {
    if (siteId && serialNumber && startDate && endDate ) {
      handleAnalytics(pageType);
    }
  }, [page, rowsPerPage]);
  const handleSiteIdChange = (selectedSiteId) => {
    setSiteId(selectedSiteId);
    setSerialNumber("");

    const selectedSite = siteOptions.find((site) => site.siteId === selectedSiteId);
    if (selectedSite) {
      setSerialNumberOptions(selectedSite.lstSerialNumberList.map((item) => item.serialNumber));
    } else {
      setSerialNumberOptions([]);
    }
  };

  const handleSearch = async () => {
    if (!token) return; // Only allow search if the token exists
    if (siteId && serialNumber) {
      try {
        setMdata(null);
        setData([]);
        setCharger([]);
        setLocation(null);
        setLiveTime(null);

        const manufacturerDetails = await fetchManufacturerDetails(siteId, serialNumber);
        const deviceResponse = await fetchDeviceDetails(siteId, serialNumber);
        const { chargerMonitoringDTO, deviceDataDTO, packetDateTime } = deviceResponse;

        if (deviceDataDTO.length > 0) {
          setData(deviceDataDTO);
          setMdata(manufacturerDetails);
          setLiveTime(packetDateTime);
        }
        if (deviceResponse && chargerMonitoringDTO) {
          setCharger(chargerMonitoringDTO);
        }
        const selectedSite = siteOptions.find((site) => site.siteId === siteId);
        setLocation(selectedSite);

        return deviceResponse;
      } catch (error) {
        console.error("Error during search:", error);
        if (error.response?.status === 401) {
          handleLogout();
        }
      }
    } else {
      console.error("Please select both Site ID and Serial Number.");
    }
  };
  const handleAnalytics = async () => {
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
      setDayWiseData([])
      setAlarmsData([])
      setrealTimeData([])
      setLoadingReport(true);
      let result;
      switch (pageType) {
        case "historical":
          result = await fetchHistoricalBatteryandChargerdetails(
            serialNumber,
            siteId,
            startDate,
            endDate,page,rowsPerPage
          );
          setrealTimeData(result)
          setTotalRecords(result.page.totalElements)
          break;

        case "daywise":
          result = await fetchDaywiseBatteryandChargerdetails(
            serialNumber,
            siteId,
            startDate,
            endDate,page,rowsPerPage
          );
          setDayWiseData(result);
          setTotalRecords(result.totalElements)
          break;

        case "alarms":
          result = await fetchAlarmsBatteryandChargerdetails(
            serialNumber,
            siteId,
            startDate,
            endDate
            ,page,rowsPerPage
          );
          setAlarmsData(result)
          setTotalRecords(result.page.totalElements)
          break;

        default:
          throw new Error("Invalid page type");
      }

      return result;
     
    } catch (error) {
      console.error("Error during search:", error);
    } finally {
      setLoadingReport(false);
    }
  };
  const handleLogout = (navigate) => {
    sessionStorage.removeItem("token");
    setToken("");
    setUserRole("");
    setUsername("");
    if (navigate) {
      navigate("/login"); 
    } 
  };
  
  const contextValue = {
    siteOptions,
    handleSearch,
    serialNumberOptions,
    siteId,
    serialNumber,
    setSiteId: handleSiteIdChange,
    setSerialNumber,
    handleLogout, // Pass handleLogout to context
    data,
    setData,
    Mdata,
    setMdata,
    location,
    setLocation,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    username,
    setUsername,
    year,
    setYear,
    month,
    userRole,
    setUserRole,
    marginMinutes,
    setMarginMinutes,
    setMonth,
    charger,
    setCharger,
    liveTime,
    setLiveTime,
    mapMarkers,
    setMapMarkers,
    token,pageType,setPageType,
    setToken,dayDaywiseData,alarmsData,realTimeData,setDayWiseData,setAlarmsData,setrealTimeData,
    page, setPage,rowsPerPage, setRowsPerPage,loadingReport,errors,totalRecords, setTotalRecords,
    handleAnalytics
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const formatToTime = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};
export const formatDate = (dateInput) => {
  let dateString;

  // Handle different input types
  if (dateInput instanceof Date) {
      date = dateInput; // Use directly if it's already a Date object
  } else if (typeof dateInput === 'string') {
      // Decode URL-encoded string if necessary (e.g., "%20" -> " ")
      dateString = decodeURIComponent(dateInput);
      date = new Date(dateString);
  } else if (typeof dateInput === 'number') {
      date = new Date(dateInput); // Handle timestamp
  } else {
      throw new Error('Invalid date input: ' + dateInput);
  }

  // Check if the date is valid
  if (isNaN(date.getTime())) {
      throw new Error('Unable to parse date: ' + dateInput);
  }

  // Format the date to "yyyy-MM-dd HH:mm:ss"
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};