import { Box, IconButton, useTheme, Typography,Grid } from "@mui/material";
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
    handleSearch,data
  } = useContext(AppContext);

  const [errors, setErrors] = useState({ siteId: false, serialNumber: false });

  // Determine if navigated from dashboard
  const fromDashboard = location.state?.from === '/';

  // Handle back navigation to dashboard
  const handleBackToDashboard = () => navigate('/');


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

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  }

  return (
    <Grid
    container
    spacing={1} // Consistent gap between items
    direction="row"
    alignItems="center" // Vertically center all items
    justifyContent="space-around" // Horizontally center the entire row
    overflow="hidden"
    sx={{
      marginBottom: 2,
      paddingTop: "5px",
      flexWrap: "nowrap", // Prevent wrapping to keep everything in one row
      width: "100%", // Full width of the parent container
    }}
  >
    {/* Back Button */}
    {fromDashboard && (
        <Grid item xs="auto" sx={{ flexShrink: 0 }}>
          <IconButton onClick={handleBackToDashboard} sx={{ color: "black" }}>
            <ArrowBackIcon />
          </IconButton>
        </Grid>
      )}
  
    {/* Search Options */}
    <Grid item xs="auto" sx={{ flexShrink: 0, minWidth: 160 }}>
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
            InputLabelProps={{ sx: { fontWeight: "bold" } }}
            sx={{
              "& .MuiInputBase-root": {
                fontWeight: "bold",
                height: "40px",
                marginTop: "5px",
              },
              width: "100%", // Full width of the Grid item
            }}
          />
        )}
      />
    </Grid>
    <Grid item xs="auto" sx={{ flexShrink: 0, minWidth: 170 }}>
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
            InputLabelProps={{ sx: { fontWeight: "bold" } }}
            sx={{
              "& .MuiInputBase-root": {
                fontWeight: "bold",
                height: "40px",
                marginTop: "5px",
              },
              width: "100%", // Full width of the Grid item
            }}
          />
        )}
      />
    </Grid>
    <Grid item xs="auto" sx={{ flexShrink: 0 }}>
      <IconButton onClick={handleSearch} sx={{ padding: 1 }}>
        <SearchIcon />
      </IconButton>
    </Grid>
  
    {/* Location */}
    <Grid
      item
      xs="auto"
      sx={{
        flexShrink: 0,
        minWidth: 150,
        visibility: data.length > 0 ? "visible" : "hidden", // Toggle visibility
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "1px solid",
          borderColor: colors.grey[500],
          borderRadius: "4px",
          height: "40px",
          width: "100%", // Full width of the Grid item
          px: 1, // Padding for content
        }}
      >
        <Typography variant="body2">{locationName}</Typography>
      </Box>
    </Grid>
  
    {/* DateTime */}
    <Grid
      item
      xs="auto"
      sx={{
        flexShrink: 0,
        minWidth: 150,
        visibility: data.length > 0 ? "visible" : "hidden", // Toggle visibility
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "1px solid",
          borderColor: colors.grey[500],
          borderRadius: "4px",
          height: "40px",
          width: "100%", // Full width of the Grid item
          px: 1,
          fontSize: "12px",
        }}
      >
        <Typography variant="body2">
          {convertOwlDatetimeToCustomDate(liveTime)}
        </Typography>
      </Box>
    </Grid>
  
    {/* Customer Name */}
    <Grid
      item
      xs="auto"
      sx={{
        flexShrink: 0,
        minWidth: 150,
        visibility: data.length > 0 ? "visible" : "hidden", // Toggle visibility
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "1px solid",
          borderColor: colors.grey[500],
          borderRadius: "4px",
          height: "40px",
          width: "100%", // Full width of the Grid item
          px: 1,
          pointer: "cursor",
        }}
      >
        <Typography variant="body2">{vendorName}</Typography>
      </Box>
    </Grid>
  
    {/* Color Indicators */}
    <Grid
      item
      xs="auto"
      sx={{
        flexShrink: 0,
        minWidth: 200,
        visibility: data.length > 0 ? "visible" : "hidden", // Toggle visibility
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          height: "50px",
          width: "100%", // Full width of the Grid item
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            mr: 1, // Margin for spacing
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
            Failure/high/Tripped
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            mr: 1,
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
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
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
    </Grid>
  </Grid>
  );
  
};

export default Topbar;