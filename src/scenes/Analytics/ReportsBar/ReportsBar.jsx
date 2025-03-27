import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../services/AppContext";
import {
  Box,
  IconButton,
  TextField,
  Autocomplete,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const ReportsBar = ({ pageType }) => {
  const theme = useTheme();

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
    errors,
    page,
    rowsPerPage,setData
  } = useContext(AppContext);

  // Reset search fields when pageType changes
  useEffect(() => {
    setSiteId(""); // Reset Site ID
    setSerialNumber(""); // Reset Serial Number
    setStartDate(""); // Reset Start Date
    setEndDate("");
    setData([]);
  }, [pageType]);

  useEffect(() => {
    if (siteId && serialNumber && startDate && endDate) {
      handleAnalytics(pageType);
    }
  }, [page, rowsPerPage]);

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
          disableClearable
          options={siteOptions.map((site) => site.siteId)}
          value={siteId}
          onChange={(event, newValue) => setSiteId(newValue)}
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
          value={startDate?.split("%")[0] || ""}
          onChange={(e) => {
            const updatedDate = e.target.value + "%2000:00:00";
            setStartDate(updatedDate);
          }}
          fullWidth
          error={errors.startDate}
          helperText={errors.startDate ? "Please select Start Date" : ""}
          sx={{
            width: 200,
            "& .MuiInputBase-root": {
              fontWeight: "bold",
              height: "35px",
              marginTop: "5px",
            },
            "& .MuiInputLabel-root": {
              fontWeight: "bold",
            },
          }}
          InputLabelProps={{
            shrink: true,
          }}
        />

        {/* End Date */}
        <TextField
          label="End Date"
          type="date"
          value={endDate?.split("%")[0] || ""}
          onChange={(e) => setEndDate(e.target.value + "%2023:59:59")}
          fullWidth
          error={errors.endDate}
          helperText={errors.endDate ? "Please select End Date" : ""}
          sx={{
            width: 200,
            "& .MuiInputBase-root": {
              fontWeight: "bold",
              height: "35px",
              marginTop: "5px",
            },
            "& .MuiInputLabel-root": {
              fontWeight: "bold",
            },
          }}
          InputLabelProps={{
            shrink: true,
          }}
        />

        {/* Search Button */}
        <IconButton
          onClick={() => handleAnalytics(pageType)}
          disabled={loadingReport}
        >
          <SearchIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ReportsBar;