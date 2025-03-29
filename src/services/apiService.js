import axios from "axios";

const BASE_URL = "http://122.175.45.16:51270"; // Adjust if your backend runs on a different port (e.g., 8080)

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
    const token = sessionStorage.getItem("token");
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
export const fetchHistoricalBatteryandChargerdetails =async (serialNumber,siteId,strStartDate,strEndDate,page,size)=>{
  try{
    const response =await apiClient.get(
      `${BASE_URL}/getHistoricalStringDataBySiteidAndSerialNumberBetweenDateswithPg?page=${page}&size=${size}&sort=serverTime,desc&siteId=${siteId}&serialNumber=${serialNumber}
                                                                          &strStartDate=${strStartDate}&strEndDate=${strEndDate}`
    );
    return response.data;
  }
  catch(error){
    console.error("Error fetching Historical String details",error);
    throw error;
  }

  }
  export const downloadHistoricalBatteryandChargerdetails=async(siteId,serialNumber,strStartDate,strEndDate)=>{
   
    try {
      // Construct the query parameters
      const params = {
          siteId,
          serialNumber,
          strStartDate,
          strEndDate,
      };

      // Make a GET request to the backend endpoint using Axios
      const response = await apiClient.get(`${BASE_URL}/downloadHistoricalStringReport`, {
          params, // Pass query parameters
          responseType: 'blob', // Ensure the response is treated as a Blob (binary data)
      });

      // Create a temporary URL for the Blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a temporary anchor element to trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = `HistoricalStringReport_${siteId}_${serialNumber}.xls`; // Set the file name
      document.body.appendChild(a); // Append the anchor to the DOM
      a.click(); // Programmatically click the anchor to trigger the download

      // Clean up
      window.URL.revokeObjectURL(url); // Release the object URL
      document.body.removeChild(a); // Remove the anchor from the DOM
  } catch (error) {
      console.error('Error downloading the Excel file:', error);
  }

    }
  export const downloadDayWiseBatteryandChargerdetails=async(siteId,serialNumber,strStartDate,strEndDate)=>{
  
    try {
      // Construct the query parameters
      const params = {
          siteId,
          serialNumber,
          strStartDate,
          strEndDate,
      };

      // Make a GET request to the backend endpoint using Axios
      const response = await apiClient.get(`${BASE_URL}/downloadDaywiseReports`, {
          params, // Pass query parameters
          responseType: 'blob', // Ensure the response is treated as a Blob (binary data)
      });

      // Create a temporary URL for the Blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a temporary anchor element to trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = `DayWiseReport_${siteId}.xls`; // Set the file name
      document.body.appendChild(a); // Append the anchor to the DOM
      a.click(); // Programmatically click the anchor to trigger the download

      // Clean up
      window.URL.revokeObjectURL(url); // Release the object URL
      document.body.removeChild(a); // Remove the anchor from the DOM
  } catch (error) {
      console.error('Error downloading the Excel file:', error);
  }

    }
    export const downloadBatteryAlarms=async(siteId,serialNumber,strStartDate,strEndDate)=>{

      try {
        // Construct the query parameters
        const params = {
            siteId,
            serialNumber,
            strStartDate,
            strEndDate,
        };
  
        // Make a GET request to the backend endpoint using Axios
        const response = await apiClient.get(`${BASE_URL}/downloadHistoricalAlarmsReport`, {
            params, // Pass query parameters
            responseType: 'blob', // Ensure the response is treated as a Blob (binary data)
        });
  
        // Create a temporary URL for the Blob
        const url = window.URL.createObjectURL(new Blob([response.data]));
  
        // Create a temporary anchor element to trigger the download
        const a = document.createElement('a');
        a.href = url;
        a.download = `AlarmsReport_${siteId}.xls`; // Set the file name
        document.body.appendChild(a); // Append the anchor to the DOM
        a.click(); // Programmatically click the anchor to trigger the download
  
        // Clean up
        window.URL.revokeObjectURL(url); // Release the object URL
        document.body.removeChild(a); // Remove the anchor from the DOM
    } catch (error) {
        console.error('Error downloading the Excel file:', error);
    }
  
      }

  export const fetchDaywiseBatteryandChargerdetails =async (serialNumber,siteId,strStartDate,strEndDate,page,size)=>{
    try{
      const response =await apiClient.get(
        `${BASE_URL}/getDaywiseReports?siteId=${siteId}&serialNumber=${serialNumber}
                                                                            &strStartDate=${strStartDate}&strEndDate=${strEndDate}&page=${page}&size=${size}`
      );
      return response.data;
    }
    catch(error){
      console.error("Error fetching Daywise String details",error);
      throw error;
    }
     
  }
  export const fetchCycleData=async(siteId,serialNumber,date)=>{
    try{
      const response = await apiClient.get(`${BASE_URL}/getDaywiseCycleReports?siteId=${siteId}&serialNumber=${serialNumber}&date=${date}`);
      return response.data;
    }
    catch(error){
      console.error("Error fetching Daywise String details",error);
      throw error;
    }
  }

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
export const downloadBatteryAlarms=async(siteId,serialNumber,strStartDate,strEndDate)=>{

  try {
   
    const params = {
        siteId,
        serialNumber,
        strStartDate,
        strEndDate,
    };
    const response = await apiClient.get(`${BASE_URL}/downloadHistoricalAlarmsReport`, {
        params, 
        responseType: 'blob', 
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement('a');
    a.href = url;
    a.download = `AlarmsReport_${siteId}.xls`; 
    document.body.appendChild(a); 
    a.click();
    window.URL.revokeObjectURL(url); 
    document.body.removeChild(a); 
} catch (error) {
    console.error('Error downloading the Excel file:', error);
}

  }
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

export const fetchUserDetails = async () => {
  try {
    const response = await apiClient.get(`${BASE_URL}/GetAllLoginDetailsInPlainLoginDetailFormate`);
    return response.data;
  } catch (error) {
    console.error("Error in fetching login details: ", error);
    throw error;
  }
};
export const deleteUser = async (id) => {
  try {
    const response = await apiClient.delete(`${BASE_URL}/DeleteLoginUserByLoginCredId?loginCredId=${id}`);
    return response.data;
  } catch (error) {
    console.error("Error in deleting user details: ", error);
    throw error;
  }
};
export const PostUser = async (userData) => {
  try {
    const response = await apiClient.post(`${BASE_URL}/PostCreateNewLoginUser`, userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Update an existing user
export const UpdateUser = async (userData) => {
  try {
    const response = await apiClient.post(`${BASE_URL}/PostUpdateLoginUser`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const Updatesite = async () => {
  try {
    const response = await apiClient.put(`${BASE_URL}/api/updateSiteLocationToSiteId`, combinedData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const fetchCellVT = async (siteId,serialNumber,cellNumber,startDateTime,endDateTime) => {
  try {
    const response = await apiClient.get(`${BASE_URL}/getSpecificCellDataBySiteIdAndSerialNumberBetweenDates?siteId=${siteId}&serialNumber=${serialNumber}&cellNumber=${cellNumber}&strStartDate=${encodeURIComponent(startDateTime)}&strEndDate=${encodeURIComponent(endDateTime)}`);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}
export const downloadCellVTDetails=async(siteId,serialNumber,cellNumber,strStartDate,strEndDate)=>{
  
  try {
    // Construct the query parameters
    const params = {
        siteId,
        serialNumber,
        cellNumber,
        strStartDate,
        strEndDate,
    };

    // Make a GET request to the backend endpoint using Axios
    const response = await apiClient.get(`${BASE_URL}/downloadCellDataReport`, {
        params, // Pass query parameters
        responseType: 'blob', // Ensure the response is treated as a Blob (binary data)
    });

    // Create a temporary URL for the Blob
    const url = window.URL.createObjectURL(new Blob([response.data]));

    // Create a temporary anchor element to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cell${cellNumber}_VT.xls`; // Set the file name
    document.body.appendChild(a); // Append the anchor to the DOM
    a.click(); // Programmatically click the anchor to trigger the download

    // Clean up
    window.URL.revokeObjectURL(url); // Release the object URL
    document.body.removeChild(a); // Remove the anchor from the DOM
} catch (error) {
    console.error('Error downloading the Excel file:', error);
}

  }


export const getCoordinates = async (siteId) => {
  try {
    const response = await apiClient.get(`${BASE_URL}/api/getCoordinates`, {
      params: { siteId, marginMinutes: 15 },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch coordinates:', error);
    throw error;
  }
}