import { Box, TextField, Autocomplete, Typography, Tooltip, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../services/AppContext";
import {
  fetchStatesDetails,
  fetchCirclesDetails,
  fetchAreasDetails,
  fetchMapBySite,
  fetchMapByState,
  fetchMapByCircle,
  fetchMapByArea,
  fetchCommunicationStatus,
} from "../../../services/apiService";

const DashBoardBar = () => {
  const {
    serialNumberOptions,
    siteId,
    serialNumber,
    setSiteId,
    setSerialNumber,
    setMapMarkers,marginMinutes
  } = useContext(AppContext);

  const [stateOptions, setStateOptions] = useState([]);
  const [circleOptions, setCircleOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [state, setState] = useState("");
  const [circle, setCircle] = useState("");
  const [area, setArea] = useState("");
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [siteOptions, setSiteOptions] = useState([]);

  // Function to fetch initial/default data and set map markers
  const fetchInitialData = async () => {
    try {
      // const marginMinutes = 15; // Adjust this value as needed
      const commStatusData = await fetchCommunicationStatus(marginMinutes);
      const markers = [];

      if (commStatusData && commStatusData.length > 0) {
        commStatusData.forEach((item) => {
          if (item.siteLocationDTO) {
            const { latitude, longitude, area, vendorName, siteId } = item.siteLocationDTO;
            if (latitude && longitude) {
              let serialNumber = null;

              // Check if deviceDataDTO exists and is an array
              if (
                item.generalDataDTO &&
                item.generalDataDTO.deviceDataDTO &&
                item.generalDataDTO.deviceDataDTO.length > 0
              ) {
                serialNumber = item.generalDataDTO.deviceDataDTO[0].serialNumber; // Get the first device's serial number
              }

              markers.push({
                lat: latitude,
                lng: longitude,
                name: area || "Unnamed Site",
                vendor: vendorName,
                statusType: item.statusType,
                siteId: siteId,
                serialNumber: serialNumber || "N/A", // Default to "N/A" if no serial number is found
              });
            }
          }
        });
      }

      setMapMarkers(markers.length > 0 ? markers : []);
    } catch (error) {
      console.error("Error fetching initial communication status:", error);
      setMapMarkers([]);
    }
  };

  // Updated clearOptions to reset filters and fetch default data
  const clearOptions = async () => {
    setSiteId("");
    setSerialNumber("");
    setState("");
    setCircle("");
    setArea("");
    setSiteOptions([]);
    setCircleOptions([]);
    setAreaOptions([]);
    await fetchInitialData(); // Fetch default data and update map markers
  };

  // Fetch states and initial data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setSiteId("");
        setSerialNumber("");
        const statesData = await fetchStatesDetails();
        setStateOptions(statesData);

        // Fetch initial map data on mount
        await fetchInitialData();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Handle state selection
  const handleStateChange = async (event, newValue) => {
    setState(newValue);
    try {
      const mapData = await fetchMapByState(newValue);
      setCircleOptions([]);
      const circles = mapData.map((site) => site.circle);
      const uniqueCircles = [...new Set(circles)];
      setCircleOptions(uniqueCircles);
      if (mapData && mapData.length > 0) {
        const updatedMarkers = mapData
          .filter((site) => site.latitude && site.longitude)
          .map((site) => ({
            lat: site.latitude,
            lng: site.longitude,
            name: site.area || "Unnamed site",
            vendor: site.vendorName,
            statusType: site.statusType,
            siteId: site.siteId,
            serialNumber: site.serialNumber || "N/A",
          }));
        if (updatedMarkers.length > 0) {
          setMapMarkers(updatedMarkers);
        } else {
          setMapMarkers([]);
        }
      } else {
        console.log("No map data found for the selected state.");
        setMapMarkers([]);
      }
    } catch (error) {
      console.error("Error fetching map data for state: ", error);
      if (error.response && error.response.status === 500) {
        setErrorDialogOpen(true);
        setMapMarkers([]);
      }
    }
  };

  // Handle circle selection
  const handleCircleChange = async (event, newValue) => {
    setCircle(newValue);
    try {
      const mapData = await fetchMapByCircle(newValue);
      setSiteOptions([]);
      const siteOptions = mapData.map((site) => site.siteId);
      setSiteOptions(siteOptions);
      if (mapData && mapData.length > 0) {
        const updatedMarkers = mapData
          .filter((site) => site.latitude && site.longitude)
          .map((site) => ({
            lat: site.latitude,
            lng: site.longitude,
            name: site.area || "Unnamed site",
            vendor: site.vendorName,
            statusType: site.statusType,
            siteId: site.siteId,
            serialNumber: site.serialNumber || "N/A",
          }));
        if (updatedMarkers.length > 0) {
          setMapMarkers(updatedMarkers);
        } else {
          setMapMarkers([]);
        }
      } else {
        console.log("No map data found for the selected circle.");
        setMapMarkers([]);
      }
    } catch (error) {
      console.error("Error fetching map data for circle: ", error);
      if (error.response && error.response.status === 500) {
        setErrorDialogOpen(true);
        setMapMarkers([]);
      }
    }
  };

  // Handle area selection
  const handleAreaChange = async (event, newValue) => {
    setArea(newValue);
    try {
      const mapData = await fetchMapByArea(newValue);
      if (mapData && mapData.length > 0) {
        const updatedMarkers = mapData
          .filter((site) => site.latitude && site.longitude)
          .map((site) => ({
            lat: site.latitude,
            lng: site.longitude,
            name: site.area || "Unnamed Site",
            vendor: site.vendorName,
            statusType: site.statusType,
            siteId: site.siteId,
            serialNumber: site.serialNumber || "N/A",
          }));
        if (updatedMarkers.length > 0) {
          setMapMarkers(updatedMarkers);
        } else {
          setMapMarkers([]);
        }
      } else {
        console.log("No map data found for the selected area.");
        setMapMarkers([]);
      }
    } catch (error) {
      console.error("Error fetching map data for area: ", error);
      if (error.response && error.response.status === 500) {
        setErrorDialogOpen(true);
        setMapMarkers([]);
      }
    }
  };

  const renderHighlightedOption = (props, option, value) => (
    <li
      {...props}
      style={{
        backgroundColor: value === option ? "#d82b27" : "inherit",
        color: value === option ? "#ffffff" : "inherit",
      }}
    >
      {option}
    </li>
  );

  return (
    <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" p={1} gap={2}>
      <Box display="grid" gridTemplateColumns="repeat(5, 1fr)" gap={2}>
        {/* State */}
        <Autocomplete
          disablePortal
          options={stateOptions.map((state) => state.name)}
          value={state}
          onChange={handleStateChange}
          renderOption={(props, option) =>
            renderHighlightedOption(props, option, state)
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="State"
              InputLabelProps={{ sx: { fontWeight: "bold" } }}
              sx={{
                "& .MuiInputBase-root": {
                  fontWeight: "bold",
                  height: "35px",
                  marginTop: "5px",
                },
              }}
            />
          )}
          sx={{ width: "150px" }}
        />

        {/* Circle */}
        <Autocomplete
          disablePortal
          options={circleOptions}
          value={circle}
          onChange={handleCircleChange}
          renderOption={(props, option) =>
            renderHighlightedOption(props, option, circle)
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Circle"
              InputLabelProps={{ sx: { fontWeight: "bold" } }}
              sx={{
                "& .MuiInputBase-root": {
                  fontWeight: "bold",
                  height: "35px",
                  marginTop: "5px",
                },
              }}
            />
          )}
          sx={{ width: "150px" }}
        />

        {/* SubStation ID */}
        <Autocomplete
          disablePortal
          options={siteOptions}
          value={siteId}
          onChange={async (event, newValue) => {
            setSiteId(newValue);
            try {
              const mapData = await fetchMapBySite(newValue);
              if (mapData) {
                const { latitude, longitude, area, vendorName, statusType, serialNumber } = mapData;
                if (latitude && longitude) {
                  const updatedMarkers = [
                    {
                      lat: latitude,
                      lng: longitude,
                      name: area || "Unnamed site",
                      vendor: vendorName,
                      statusType: statusType,
                      siteId: newValue,
                      serialNumber: serialNumber || "N/A",
                    },
                  ];
                  setMapMarkers(updatedMarkers);
                } else {
                  setMapMarkers([]);
                }
              } else {
                setMapMarkers([]);
              }
            } catch (error) {
              console.error("Error fetching map data: ", error);
              if (error.response && error.response.status === 500) {
                setErrorDialogOpen(true);
                setMapMarkers([]);
              }
            }
          }}
          renderOption={(props, option) =>
            renderHighlightedOption(props, option, siteId)
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="SubStation ID"
              InputLabelProps={{ sx: { fontWeight: "bold" } }}
              sx={{
                "& .MuiInputBase-root": {
                  fontWeight: "bold",
                  height: "35px",
                  marginTop: "5px",
                },
              }}
            />
          )}
          sx={{ width: "150px" }}
        />

        {/* Serial Number */}
        <Autocomplete
          disablePortal
          options={serialNumberOptions}
          value={serialNumber}
          onChange={(event, newValue) => setSerialNumber(newValue)}
          renderOption={(props, option) =>
            renderHighlightedOption(props, option, serialNumber)
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Serial Number"
              InputLabelProps={{ sx: { fontWeight: "bold" } }}
              sx={{
                "& .MuiInputBase-root": {
                  fontWeight: "bold",
                  height: "35px",
                  marginTop: "5px",
                },
              }}
            />
          )}
          sx={{ width: "150px" }}
        />

        {/* Clear Button */}
        <Tooltip title="Clear">
          <Box onClick={clearOptions}>
            <Typography variant="body1" sx={{ marginTop: "12px", fontSize: 15, cursor: "pointer" }}> ❌</Typography>
          </Box>
        </Tooltip>
      </Box>

      {/* Error Dialog */}
      <Dialog
        open={errorDialogOpen}
        onClose={() => setErrorDialogOpen(false)}
      >
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <DialogContentText>
            No location found for the selected criteria.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorDialogOpen(false)} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashBoardBar;