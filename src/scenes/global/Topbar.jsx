import { Box, IconButton, useTheme, Typography } from "@mui/material";
import { useContext, useState,  useEffect } from "react";
import { ColorModeContext, tokens } from "../../theme";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate , useLocation} from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { AppContext } from "../../services/AppContext";
import { fetchManufacturerDetails, fetchDeviceDetails } from "../../services/apiService";
// import { useDateTimeField } from "@mui/x-date-pickers/DateTimeField/useDateTimeField";

const Topbar = ({ liveTime="", vendorName, locationName = "" }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();
  const location = useLocation(); 

  const {
    siteOptions,
    serialNumberOptions,
    siteId,
    serialNumber,
    setSiteId,
    setSerialNumber,
    setData,
    setMdata,
    setCharger,
    charger,setLiveTime,
    data, setLocation,handleSearch
  } = useContext(AppContext);
 

  const [errors, setErrors] = useState({
    siteId: false,
    serialNumber: false,
  });

  const fromDashboard = location.state?.fromDashboard || false;

  // Handle back navigation
  const handleBackToDashboard = () => {
    navigate("/");
  };


  function convertOwlDatetimeToCustomDate(dateString) {
    if (dateString == null || dateString == "") {
      return "";
    }
    const utcDate = new Date(dateString);

    const year = utcDate.getFullYear();
    const month = String(utcDate.getMonth() + 1).padStart(2, '0');
    const day = String(utcDate.getDate()).padStart(2, '0');
    const hours = String(utcDate.getHours()).padStart(2, '0');
    const minutes = String(utcDate.getMinutes()).padStart(2, '0');
    const seconds = String(utcDate.getSeconds()).padStart(2, '0');
    const milliseconds = String(utcDate.getMilliseconds()).padStart(3, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  }

  return (
    <Box
    display="grid"
    gridTemplateColumns="repeat(3, auto)"
    gridTemplateRows="auto"
    gridAutoRows="min-content"
    p={2} // Reduce padding
    sx={{
      marginBottom: 2, // Ensure no extra margin at the bottom
      paddingBottom: 0, // Reduce any padding at the bottom
    }}
  >
    <Box
  display="flex"
  alignItems="center"
  sx={{ marginRight: 2, color: "black" }}
>
  <IconButton 
    onClick={handleBackToDashboard} 
    sx={{ color: "black" }} // Explicitly set to black for visibility
  >
    <ArrowBackIcon />
  </IconButton>
</Box>
      {/* Search Options */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(3, auto)"
        gap={1} // Decreased gap
        sx={{ marginRight: 2 }}
      >
        <Autocomplete
          disablePortal
          disableClearable
          options={siteOptions.map((site) => site.siteId)}
          value={siteId}
          onChange={(event, newValue) => setSiteId(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Substation ID"
              error={!!errors.siteId}
              helperText={errors.siteId ? "Please enter Substation ID" : ""}
              InputLabelProps={{
                sx: {
                  fontWeight: "bold",
                },
              }}
              fullWidth
              sx={{
                "& .MuiInputBase-root": {
                  fontWeight: "bold",
                  height: "40px",
                  marginTop: "5px",
                },
              }}
            />
          )}
          sx={{ width: 200 }}
        />
        <Autocomplete
          disablePortal
          disableClearable
          options={serialNumberOptions}
          value={serialNumber}
          onChange={(event, newValue) => setSerialNumber(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Serial Number"
              InputLabelProps={{
                sx: {
                  fontWeight: "bold",
                },
              }}
              fullWidth
              sx={{
                "& .MuiInputBase-root": {
                  fontWeight: "bold",
                  height: "40px",
                  marginTop: "5px",
                },
              }}
            />
          )}
          sx={{ width: 200 }}
        />
  
  <IconButton 
  onClick={handleSearch}
  sx={{ position: "relative", top: "-3px" }} // Adjust top value as needed
>
  <SearchIcon />
</IconButton>
      </Box>
  
      {/* Location and Time */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(4, auto)" // Added one more column for the color indicators
        gap="5px" // Decreased gap
        paddingTop="5px"
        marginLeft="0px"
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            border: "1px solid",
            borderColor: colors.grey[500],
            borderRadius: "4px",
            height: "40px",
            width: "150px",
          }}
        >
          { locationName}
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            border: "1px solid",
            borderColor: colors.grey[500],
            borderRadius: "4px",
            height: "40px",
            width: "150px",
            fontSize: "12px"
          }}
        >
          {convertOwlDatetimeToCustomDate(liveTime)}
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            border: "1px solid",
            borderColor: colors.grey[500],
            borderRadius: "4px",
            height: "40px",
            width: "150px",
          }}
        >
          <IconButton>
            <PersonOutlinedIcon />
          </IconButton>
          {vendorName}
        </Box>
  
        {/* Color Indicators */}
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          sx={{
            height: "50px", // Reduced height to move it up
            width: "150px",
            marginBottom: "-5px", // Moves everything slightly up
          }}
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{
              marginRight: "10px", // Added margin for spacing
            }}
          >
            <Box
              sx={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: "rgb(183, 28, 28)", // Failure
              }}
            />
            <Typography fontSize="12px" fontWeight="bold" color="red">
              Failure
            </Typography>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{
              marginRight: "10px", // Added margin for spacing
            }}
          >
            <Box
              sx={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: "rgb(27, 94, 32)", // Normal
              }}
            />
            <Typography fontSize="12px" fontWeight="bold" color="green">
              Normal
            </Typography>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Box
              sx={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: "Orange", // Warning
              }}
            />
            <Typography fontSize="12px" fontWeight="bold" color="orange">
              Low
            </Typography>
          </Box>
        </Box>
      </Box>
  
      {/* Icons */}
      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        marginLeft="10px"
       
      >
        {/* Add any additional icons here */}
      </Box>
    </Box>
  );
  
};

export default Topbar;