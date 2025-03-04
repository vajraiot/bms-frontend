import { Box, TextField, Autocomplete } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../services/AppContext";
import {
  fetchStatesDetails,
  fetchCirclesDetails,
  fetchAreasDetails,
  fetchMapBySite,
  fetchMapByState,
  fetchMapByCircle, // Import the new function
  fetchMapByArea,   // Import the new function
} from "../../../services/apiService";

const DashBoardBar = () => {
  const {
    siteOptions,
    serialNumberOptions,
    siteId,
    serialNumber,
    setSiteId,
    setSerialNumber,
    setMapMarkers,
  } = useContext(AppContext);

  const [stateOptions, setStateOptions] = useState([]);
  const [circleOptions, setCircleOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [state, setState] = useState("");
  const [circle, setCircle] = useState("");
  const [area, setArea] = useState("");

  // Fetch all states, circles, and areas on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const statesData = await fetchStatesDetails();
        const circlesData = await fetchCirclesDetails();
        const areasData = await fetchAreasDetails();

        console.log("States Data:", statesData); // Debugging: Log the API response
        console.log("Circles Data:", circlesData); // Debugging: Log the API response
        console.log("Areas Data:", areasData); // Debugging: Log the API response

        setStateOptions(statesData);
        setCircleOptions(circlesData);
        setAreaOptions(areasData);
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
      console.log("Map Data for State:", mapData); // Debugging: Log API response

      if (mapData && mapData.length > 0) {
        const updatedMarkers = mapData.map((site) => ({
          lat: site.latitude,
          lng: site.longitude,
          name: site.area || "Unnamed Site",
          vendor: site.vendorName,
          statusType: site.statusType,
        }));
        console.log("Updated Markers for State:", updatedMarkers); // Debugging: Log updated markers
        setMapMarkers(updatedMarkers);
      }
    } catch (error) {
      console.error("Error fetching map data for state: ", error);
    }
  };

  // Handle circle selection
  const handleCircleChange = async (event, newValue) => {
    setCircle(newValue);

    try {
      const mapData = await fetchMapByCircle(newValue);
      console.log("Map Data for Circle:", mapData); // Debugging: Log API response

      if (mapData && mapData.length > 0) {
        const updatedMarkers = mapData.map((site) => ({
          lat: site.latitude,
          lng: site.longitude,
          name: site.area || "Unnamed Site",
          vendor: site.vendorName,
          statusType: site.statusType,
        }));
        console.log("Updated Markers for Circle:", updatedMarkers); // Debugging: Log updated markers
        setMapMarkers(updatedMarkers);
      }
    } catch (error) {
      console.error("Error fetching map data for circle: ", error);
    }
  };

  // Handle area selection
  const handleAreaChange = async (event, newValue) => {
    setArea(newValue);

    try {
      const mapData = await fetchMapByArea(newValue);
      console.log("Map Data for Area:", mapData); // Debugging: Log API response

      if (mapData && mapData.length > 0) {
        const updatedMarkers = mapData.map((site) => ({
          lat: site.latitude,
          lng: site.longitude,
          name: site.area || "Unnamed Site",
          vendor: site.vendorName,
          statusType: site.statusType,
        }));
        console.log("Updated Markers for Area:", updatedMarkers); // Debugging: Log updated markers
        setMapMarkers(updatedMarkers);
      }
    } catch (error) {
      console.error("Error fetching map data for area: ", error);
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
              InputLabelProps={{
                sx: {
                  fontWeight: "bold",
                },
              }}
              sx={{
                "& .MuiInputBase-root": {
                  fontWeight: "bold",
                  height: "35px",
                  marginTop: '5px',
                },
              }}
            />
          )}
          sx={{ width: "150px" }}
        />

        {/* Circle */}
        <Autocomplete
          disablePortal
          options={circleOptions.map((circle) => circle.name)}
          value={circle}
          onChange={handleCircleChange}
          renderOption={(props, option) =>
            renderHighlightedOption(props, option, circle)
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Circle"
              InputLabelProps={{
                sx: {
                  fontWeight: "bold",
                },
              }}
              sx={{
                "& .MuiInputBase-root": {
                  fontWeight: "bold",
                  height: "35px",
                  marginTop: '5px',
                },
              }}
            />
          )}
          sx={{ width: "150px" }}
        />

        {/* SubStation ID */}
        
        <Autocomplete
          disablePortal
          options={siteOptions.map((site) => site.siteId)}
          value={siteId}
          onChange={async (event, newValue) => {
            setSiteId(newValue);
            try {
              const mapData = await fetchMapBySite(newValue);
              console.log("Map Data:", mapData); // Debugging: Log API response

              if (mapData) {
                const { latitude, longitude, area, vendorName, statusType } = mapData;
                if (latitude && longitude) {
                  const updatedMarkers = [
                    {
                      lat: latitude,
                      lng: longitude,
                      name: area || "Unnamed Site",
                      vendor: vendorName,
                      statusType: statusType,
                    },
                  ];
                  console.log("Updated Markers:", updatedMarkers); // Debugging: Log updated markers
                  setMapMarkers(updatedMarkers);
                }
              }
            } catch (error) {
              console.error("Error fetching map data: ", error);
            }
          }}
          renderOption={(props, option) =>
            renderHighlightedOption(props, option, siteId)
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="SubStation ID"
              InputLabelProps={{
                sx: {
                  fontWeight: "bold",
                },
              }}
              sx={{
                "& .MuiInputBase-root": {
                  fontWeight: "bold",
                  height: "35px",
                  marginTop: '5px',
                },
              }}
            />
          )}
          sx={{ width: "150px" }}
        />

        {/* Serial Number */}
        <Autocomplete
  disablePortal
  // Remove disableClearable or set it to false
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
      InputLabelProps={{
        sx: {
          fontWeight: "bold",
        },
      }}
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

        {/* State */}
       
        {/* Area */}
        {/* <Autocomplete
          disablePortal
          disableClearable
          options={areaOptions.map((area) => area.name)}
          value={area}
          onChange={handleAreaChange}
          renderOption={(props, option) =>
            renderHighlightedOption(props, option, area)
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Area"
              InputLabelProps={{
                sx: {
                  fontWeight: "bold",
                },
              }}
              sx={{
                "& .MuiInputBase-root": {
                  fontWeight: "bold",
                  height: "35px",
                  marginTop: '5px',
                },
              }}
            />
          )}
          sx={{ width: "150px" }}
        /> */}
      </Box>
    </Box>
  );
};

export default DashBoardBar;