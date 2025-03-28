import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../services/AppContext";
import {
  Box,
  IconButton,
  Typography,
  TextField,
  Autocomplete,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const ReportsBar = ({ pageType }) => {
  const theme = useTheme();
  
  const [errors, setErrors] = useState({ startDate: false, endDate: false });
  const {
    siteOptions,
    serialNumberOptions,
    siteId,
    serialNumber,
    startDate,
    endDate,
    setSiteId,
    setSerialNumber,
    setStartDate,
    setEndDate,
    handleAnalytics,
    loadingReport,
    setPageType,
    page,
    rowsPerPage,setData,data,setDayWiseData,setAlarmsData,setrealTimeData

  } = useContext(AppContext);

  // Reset search fields when pageType changes
  useEffect(() => {
    setPageType(pageType)
    setSiteId(""); // Reset Site ID
    setSerialNumber(""); // Reset Serial Number
    setStartDate(""); // Reset Start Date
    setEndDate("");
    setDayWiseData([]);
    setAlarmsData([]);
    setrealTimeData([])
  }, [pageType]);
 const clearOptions = () => {
    setSiteId(""); // Reset Site ID
    setSerialNumber(""); // Reset Serial Number
    setStartDate(""); // Reset Start Date
    setEndDate("");
    setData([]);
  };

const handleFunction=async()=>{
  const result =await handleAnalytics()
 
}


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
    <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" p={2} gap={2}>
      {/* Filters and Search Section */}
      <Box display="grid" gridTemplateColumns="repeat(5, 1fr)" gap={2}>
        {/* Site ID */}
        <Autocomplete
          disablePortal
          freeSolo
          disableClearable
          options={siteOptions.map((site) => site.siteId)}
          value={siteId}
          onChange={(event, newValue) => setSiteId(newValue)}
          filterOptions={(options, { inputValue }) => {
            if (!inputValue) return [];
            const lowerInput = inputValue.toLowerCase();
            return options.filter((option) =>
              option.toLowerCase().startsWith(lowerInput)
            );
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
              fullWidth
              error={errors.siteId}
              helperText={errors.siteId ? "Please enter Site ID" : ""}
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
              fullWidth
              error={errors.serialNumber}
              helperText={errors.serialNumber ? "Please enter Serial Number" : ""}
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

        {/* Start Date */}
        <TextField
                  label="Start Date"
                  type="date"
                  value={startDate?.split('%')[0] || ''}
                  onChange={(e) => {
                    const updatedDate = e.target.value + '%2000:00:00';
                    setStartDate(updatedDate);
                    setErrors((prev) => ({ ...prev, startDate: false }));
                  }}
                  fullWidth
                  error={errors.startDate}
                  helperText={errors.startDate ? 'Please select Start Date' : ''}
                  sx={{
                    width: 200,
                    '& .MuiInputBase-root': {
                      fontWeight: 'bold',
                      height: '35px',
                      marginTop: '5px',
                    },
                    '& .MuiInputLabel-root': { fontWeight: 'bold' },
                  }}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    max: endDate?.split('%')[0] || undefined
                  }}
                />
                <TextField
                  label="End Date"
                  type="date"
                  value={endDate?.split('%')[0] || ''}
                  onChange={(e) => {
                    const updatedDate = e.target.value + '%2023:59:59';
                    setEndDate(updatedDate);
                    setErrors((prev) => ({ ...prev, endDate: false }));
                  }}
                  fullWidth
                  error={errors.endDate}
                  helperText={errors.endDate ? 'Please select End Date' : ''}
                  sx={{
                    width: 200,
                    '& .MuiInputBase-root': {
                      fontWeight: 'bold',
                      height: '35px',
                      marginTop: '5px',
                    },
                    '& .MuiInputLabel-root': { fontWeight: 'bold' },
                  }}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    min: startDate?.split('%')[0] || undefined
                  }}
                />

        {/* Search and Clear Buttons */}
         <Box display="flex" gap={1} alignItems="center">
          {/* Search Button */}
          <IconButton
            onClick={() => handleAnalytics(pageType)}
            disabled={loadingReport && !siteId || !startDate || !endDate}
           
          >
            <SearchIcon />
          </IconButton>

          {/* Clear Button */}
          <Box onClick={clearOptions}  disabled={!siteId || !startDate || !endDate} sx={{ cursor: "pointer" }}>
            <Typography variant="body1" sx={{ fontSize: 15 }}>
              ❌
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ReportsBar;