import { Box, TextField, Autocomplete ,React} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../services/AppContext";
import {
  fetchStatesDetails,
  fetchCirclesDetails,
  fetchAreasDetails,
  fetchMapBySite, // Ensure this function is imported
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

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const data = await fetchStatesDetails();
        setStateOptions(data);
      } catch (error) {
        console.error("Error fetching state options:", error);
      }
    };
    fetchStates();
  }, []);
//  useEffect(() => {
//     console.log("MapComponent re-rendered with markers:", mapMarkers);
//   }, [mapMarkers]);

  const handleStateChange = (event, newValue) => {
    setState(newValue);
    setCircle("");
    setArea("");

    fetchCirclesDetails().then((data) => {
      const filteredCircles = data.filter((circle) => circle.stateName === newValue);
      setCircleOptions(filteredCircles);
    });
  };

  const handleCircleChange = (event, newValue) => {
    setCircle(newValue);
    setArea("");

    fetchAreasDetails().then((data) => {
      const filteredAreas = data.filter((area) => area.circleName === newValue);
      setAreaOptions(filteredAreas);
    });
  };

  const handleAreaChange = (event, newValue) => {
    setArea(newValue);
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
    <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" p={1} gap={2} >
      <Box display="grid" gridTemplateColumns="repeat(5, 1fr)" gap={2}>
        {/* SubStation ID */}
        <Autocomplete
  disablePortal
  disableClearable
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
          disableClearable
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
                  marginTop: '5px',
                },
              }}
            />
          )}
          sx={{ width: "150px" }}
        />

        {/* State */}
        <Autocomplete
          disablePortal
          disableClearable
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
          disableClearable
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

        {/* Area */}
        <Autocomplete
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
        />
      </Box>
    </Box>
  );
};

export default DashBoardBar;