import React, { createContext, useState, useEffect } from "react";
import { fetchAllSiteIds, fetchDeviceDetails, fetchManufacturerDetails } from "./apiService";

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
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [charger, setCharger] = useState(null);
  const [liveTime, setLiveTime] = useState(null);
  const [mapMarkers, setMapMarkers] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [username, setUsername] = useState("");
  const [marginMinutes, setMarginMinutes] = useState(15);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    const fetchOptions = async () => {
      if (!isAuthenticated) return;
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
  }, [isAuthenticated]);

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
    if (!isAuthenticated) return; // Navigation handled by AuthenticatedRoute
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setIsAuthenticated(false);
    setUserRole("");
    setUsername("");
    // Navigation handled by AuthenticatedRoute
  };

  const contextValue = {
    siteOptions,
    handleSearch,
    serialNumberOptions,
    siteId,
    serialNumber,
    setSiteId: handleSiteIdChange,
    setSerialNumber,
    handleLogout,
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
    isAuthenticated,
    setIsAuthenticated,
    charger,
    setCharger,
    liveTime,
    setLiveTime,
    mapMarkers,
    setMapMarkers,
    token,
    setToken,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const formatToTime = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};