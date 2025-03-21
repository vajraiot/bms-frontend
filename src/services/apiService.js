import axios from "axios";

const BASE_URL = "http://localhost:51270"; // Adjust if your backend runs on a different port (e.g., 8080)

// Create an Axios instance with default configuration
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add JWT token to every request via interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const fetchAllSiteIds = async () => {
  try {
    const response = await apiClient.get("/getAllSiteIdWithSerialNumbers");
    return response.data;
  } catch (error) {
    console.error("Error fetching site data:", error);
    throw error;
  }
};

export const fetchCommunicationStatus = async (marginMinutes) => {
  try {
    const response = await apiClient.get("/getCommnStatus", {
      params: { marginMinutes },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching communication status:", error);
    throw error;
  }
};

export const fetchManufacturerDetails = async (siteId, serialNumber) => {
  try {
    const response = await apiClient.get(
      `/getManufacturerDetailsBySiteIdAndSerialNumber?siteId=${siteId}&serialNumber=${serialNumber}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching manufacturer details:", error);
    throw error;
  }
};

export const fetchDeviceDetails = async (siteId, serialNumber) => {
  try {
    const response = await apiClient.get(
      `/getGeneralDataBySiteIdAndSerialNumber?siteId=${siteId}&serialNumber=${serialNumber}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching device details:", error);
    throw error;
  }
};
export const fetchHistoricalBatteryandChargerdetails = async (
  serialNumber,
  siteId,
  strStartDate,
  strEndDate,
  page,
  rowsPerPage
) => {
  try {
    const response = await apiClient.get(
      `/getHistoricalStringDataBySiteidAndSerialNumberBetweenDateswithPg?siteId=${siteId}&serialNumber=${serialNumber}&strStartDate=${strStartDate}&strEndDate=${strEndDate}&page=${page}&size=${rowsPerPage}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Historical String details:", error);
    throw error;
  }
};

export const fetchDaywiseBatteryandChargerdetails = async (
  serialNumber,
  siteId,
  strStartDate,
  strEndDate
) => {
  try {
    const response = await apiClient.get(
      `/getDaywiseReports?siteId=${siteId}&serialNumber=${serialNumber}&strStartDate=${strStartDate}&strEndDate=${strEndDate}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Daywise String details:", error);
    throw error;
  }
};

export const fetchAlarmsBatteryandChargerdetails = async (
  serialNumber,
  siteId,
  strStartDate,
  strEndDate
) => {
  try {
    const response = await apiClient.get(
      `/getHistoricalAlarmsDataBySiteidAndSerialNumberBetweenDateswithPg?siteId=${siteId}&serialNumber=${serialNumber}&strStartDate=${strStartDate}&strEndDate=${strEndDate}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Alarms String details:", error);
    throw error;
  }
};

export const fetchMonthlyBatteryandChargerdetails = async (
  serialNumber,
  siteId,
  year,
  month
) => {
  try {
    const response = await apiClient.get(
      `/getMonthlyReports?siteId=${siteId}&serialNumber=${serialNumber}&year=${year}&month=${month}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Monthly String details:", error);
    throw error;
  }
};

export const fetchSiteDetailsBatteryandChargerdetails = async (
  siteId,
  serialNumber
) => {
  try {
    const response = await apiClient.get("/api/location", {
      params: { siteId, serialNumber },
    });
    console.log("Full Response: ", response);
    return response.data;
  } catch (error) {
    console.error("Error in fetching site details: ", error);
    throw error;
  }
};

export const addSiteLocation = async (siteId, formData) => {
  try {
    console.log(siteId + " posting data: " + JSON.stringify(formData));
    const payload = {
      siteId: siteId,
      SiteLocationDTO: JSON.stringify(formData),
    };

    const response = await apiClient.post("/api/postAddNewLocationToSiteId", payload);
    console.log("Response from addSiteLocation:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error while adding new site location:", error);
    throw error;
  }
};

export const updateSiteLocation = async (siteLocation) => {
  try {
    const payload = {
      SiteLocationDTO: siteLocation,
    };
    const response = await apiClient.put("/api/updateSiteLocationToSiteId", payload);
    console.log("Full Response: ", response);
    return response.data;
  } catch (error) {
    console.error("Error updating site location: ", error);
    throw error;
  }
};

export const deleteSite = async (siteId, serialNumber) => {
  try {
    const response = await apiClient.delete("/api/deleteSiteLocationToSiteId", {
      params: { siteId, serialNumber },
    });
    console.log("Delete Response: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting site:", error);
    throw error;
  }
};

export const fetchManfacurareDetailsBatteryandChargerdetails = async () => {
  try {
    const response = await apiClient.get("/getAllManufacturerDetails");
    console.log("Full Response: ", response);
    return response.data;
  } catch (error) {
    console.error("Error in fetching manufacturer details: ", error);
    throw error;
  }
};

export const ManufacturerDeleteSite = async (siteId, serialNumber) => {
  try {
    const api = "/deleteManufacturerDetailsBySiteIdAndSerialNumber";
    console.log("Making DELETE request to:", api, "with params:", { siteId, serialNumber });
    const response = await apiClient.delete(api, {
      params: { siteId, serialNumber },
    });
    console.log("Delete API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in ManufacturerDeleteSite API call:", error.response || error.message || error);
    throw error;
  }
};

export const fetchStatesDetails = async () => {
  try {
    const response = await apiClient.get("/api/states");
    console.log("Full Response for States: ", response);
    return response.data;
  } catch (error) {
    console.error("Error in fetching states details: ", error);
    throw error;
  }
};

export const fetchCirclesDetails = async () => {
  try {
    const response = await apiClient.get("/api/circles");
    console.log("Full Response for Circles: ", response);
    return response.data;
  } catch (error) {
    console.error("Error in fetching circles details: ", error);
    throw error;
  }
};

export const fetchAreasDetails = async () => {
  try {
    const response = await apiClient.get("/api/areas");
    console.log("Full Response for Areas: ", response);
    return response.data;
  } catch (error) {
    console.error("Error in fetching areas details: ", error);
    throw error;
  }
};

export const fetchLoginRoles = async () => {
  try {
    const response = await apiClient.get("/getListofLoginRoles");
    console.log("Full Response for Roles: ", response);
    return response.data;
  } catch (error) {
    console.error("Error in fetching roles details: ", error);
    throw error;
  }
};

export const fetchMapBySite = async (siteId) => {
  try {
    const response = await apiClient.get(`/api/getCoordinates?siteId=${siteId}&marginMinutes=15`);
    return response.data;
  } catch (error) {
    console.error("Error in fetching Map details: ", error);
    throw error;
  }
};

export const fetchMapByState = async (state) => {
  try {
    const response = await apiClient.get(`/api/getCoordinates/states?state=${state}&marginMinutes=20`);
    return response.data;
  } catch (error) {
    console.error("Error in fetching Map details: ", error);
    throw error;
  }
};

export const fetchMapByCircle = async (circle) => {
  try {
    const response = await apiClient.get(`/api/getCoordinates/circle?circle=${circle}&marginMinutes=20`);
    return response.data;
  } catch (error) {
    console.error("Error in fetching Map details: ", error);
    throw error;
  }
};

export const fetchMapByArea = async (area) => {
  try {
    const response = await apiClient.get(`/api/getCoordinates/area?area=${area}&marginMinutes=20`);
    return response.data;
  } catch (error) {
    console.error("Error in fetching Map details: ", error);
    throw error;
  }
};