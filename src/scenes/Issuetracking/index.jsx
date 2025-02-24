import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  CircularProgress,
  useTheme,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import Autocomplete from '@mui/material/Autocomplete';
import { AppContext } from "../../services/AppContext";
import { tokens } from "../../theme";

const BASE_URL = "http://122.175.45.16:51270";

const TicketTable = () => {
  const [siteId, setSiteId] = useState('CHARAN4048');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [tickets, setTickets] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [errors, setErrors] = useState({ startDate: false, endDate: false }); // Add error state

  const { siteOptions } = useContext(AppContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Fetch tickets whenever `page` or `rowsPerPage` changes
  const last7daysTickets = async (currentPage) => {
    try {
      const response = await axios.get(`${BASE_URL}/latest7days?page=${currentPage}&size=${rowsPerPage}`);
      setTickets(response.data.content); // Use `.content` for paginated data
      setTotalPages(response.data.totalElements); // Set the total number of records
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const TimeFormat = (dateString) => {
    if (dateString == null) {
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
  };

  const fetchTickets = async (currentPage) => {
    if (!startDate || !endDate) {
      console.error("Start date or end date is missing");
      setErrors({ startDate: !startDate, endDate: !endDate }); // Set errors if dates are missing
      return; // Prevent the API call if dates are missing
    }

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const formattedStartDate = formatDate(new Date(startDate.split("%")[0]));
    const formattedEndDate = formatDate(new Date(endDate.split("%")[0]));

    const url = `${BASE_URL}/tickets?siteId=${siteId}&start=${formattedStartDate}T00:00:00&end=${formattedEndDate}T23:59:59&page=${currentPage}&size=${rowsPerPage}`;

    try {
      setTickets([]);
      setTotalPages(0);
      const response = await axios.get(url);
      setTickets(response.data.content); // Use `.content` for paginated data
      setTotalPages(response.data.totalElements); // Set the total number of records
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleFetchTickets = () => {
    // Only fetch tickets if startDate and endDate are selected
    if (startDate && endDate) {
      fetchTickets(page); // Call fetchTickets with the current page value
    } else {
      last7daysTickets(page);
    }
  };

  // Call fetchTickets on initial load with the correct page value
  useEffect(() => {
    handleFetchTickets(); // Use the `page` state to fetch tickets initially
  }, []); // Empty dependency array ensures this runs once on component mount

  const [hoverData, setHoverData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFetchCoordinates = async (siteId) => {
    setHoverData(null);
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/getCoordinates`, {
        params: {
          siteId,
          marginMinutes: 15,
        },
      });
      setHoverData(response.data);
    } catch (error) {
      console.error("Failed to fetch coordinates:", error);
      setHoverData(null);
    } finally {
      setLoading(false);
    }
  };

  const renderHoverContent = () => {
    if (loading) {
      return <CircularProgress size={20} />;
    }

    if (!hoverData) {
      return (
        <Typography variant="body2" color="textSecondary">
          View site details
        </Typography>
      );
    }

    return (
      <Box
        sx={{
          textAlign: "left",
          maxWidth: 200,
          p: 1, // Adds padding inside the box
          border: "1px solid #ddd", // Border around the content
          borderRadius: "8px", // Rounded corners
          boxShadow: "0px 2px 4px rgba(0,0,0,0.1)", // Adds subtle shadow
        }}
      >
        <Typography variant="h6">
          <strong>State:</strong> {hoverData.state}
        </Typography>
        <Typography variant="h6">
          <strong>Circle:</strong> {hoverData.circle}
        </Typography>
        <Typography variant="h6">
          <strong>Area:</strong> {hoverData.area}
        </Typography>
        <Typography variant="h6">
          <strong>Vendor:</strong> {hoverData.vendorName}
        </Typography>
        <Typography variant="h6">
          <strong>Status:</strong>{" "}
          {hoverData.statusType === 0 ? "Inactive" : "Active"}
        </Typography>
      </Box>
    );
  };

  const CustomPagination = ({ totalPages, currentPage }) => {
    const handlePrevious = () => {
      const newPage = currentPage - 1;
      if (newPage >= 0) {
        setPage(0);
        setPage(newPage);
        if (startDate && endDate) {
          fetchTickets(newPage);
        } else {
          last7daysTickets(newPage);
        }
      }
    };

    const handleNext = () => {
      const newPage = currentPage + 1;
      if (newPage < totalPages) {
        setPage(0);
        setPage(newPage);
        if (startDate && endDate) {
          fetchTickets(newPage);
        } else {
          last7daysTickets(newPage);
        }
      }
    };

    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        mt={2}
        sx={{
          ml: '700px',
          padding: '10px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          position: 'sticky',
          bottom: '10px',
          zIndex: 1000,
        }}
      >
        <Button
          onClick={handlePrevious}
          disabled={currentPage === 0}
          sx={{
            marginRight: 1,
            background: 'linear-gradient(to bottom, #d82b27, #f09819)',
            color: 'white', // Set text color to white
            '&:hover': {
              backgroundColor: '#a1221f', // Optional: Darken background on hover
            },
          }}
        >
          Previous
        </Button>
        <Typography
          variant="body1"
          mx={2}
          sx={{ fontWeight: 'bold', color: 'black' }}
        >
          Page {currentPage + 1} of {totalPages}
        </Typography>
        <Button
          onClick={handleNext}
          disabled={currentPage + 1 >= totalPages}
          sx={{
            marginRight: 1,
            background: 'linear-gradient(to bottom, #d82b27, #f09819)',
            color: 'white', // Set text color to white
            '&:hover': {
              backgroundColor: '#a1221f', // Optional: Darken background on hover
            },
          }}
        >
          Next
        </Button>
      </Box>
    );
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={2}>
      <Box display="flex" gap={2} mb={2} >
        
      <Autocomplete
  freeSolo
  options={siteOptions.map((site) => site.siteId)}
  value={siteId}
  onChange={(event, newValue) => setSiteId(newValue)}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Substation ID"
      sx={{
        width: 150,
        height: 30,
        mt: 0.6, // Moves the box slightly down
        "& .MuiInputBase-root": { height: 35 },
      }}
    />
  )}
/>


        {/* Start Date */}
        <TextField
          label="Start Date"
          type="date"
          value={startDate?.split("%")[0] || ""}
          onChange={(e) => {
            const updatedDate = e.target.value + "%2000:00:00";
            setStartDate(updatedDate);
            setErrors((prev) => ({ ...prev, startDate: false })); // Clear error when date is selected
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
          onChange={(e) => {
            setEndDate(e.target.value + "%2023:59:59");
            setErrors((prev) => ({ ...prev, endDate: false })); // Clear error when date is selected
          }}
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

        <IconButton onClick={handleFetchTickets}>
          <SearchIcon />
        </IconButton>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          maxHeight: 390,
          border: "1px solid black", // Set border width and color
          borderRadius: "8px",
          marginTop: "0px",
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ height: "30px" }}> {/* Decrease row height */}
              {["ID", "Alarm Status", "Raise Time", "Close Time", "Status", "Substation ID", "Serial Number"].map((header) => (
                <TableCell
                  key={header}
                  sx={{
                    fontSize: 14,
                    fontFamily: "Source Sans Pro",
                    background: "linear-gradient(to bottom, #d82b27, #f09819) !important",
                    color: "white",
                    padding: "6px", // Reduce padding to decrease row size
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id} sx={{ height: "30px" }}> {/* Reduce row height */}
                <TableCell sx={{ fontSize: 14, fontFamily: "Source Sans Pro", padding: "6px" }}>{ticket.id}</TableCell>
                <TableCell sx={{ fontSize: 14, fontFamily: "Source Sans Pro", padding: "6px" }}>{ticket.message}</TableCell>
                <TableCell sx={{ fontSize: 14, fontFamily: "Source Sans Pro", padding: "6px" }}>{TimeFormat(ticket.raiseTime)}</TableCell>
                <TableCell sx={{ fontSize: 14, fontFamily: "Source Sans Pro", padding: "6px" }}>{TimeFormat(ticket.closeTime)}</TableCell>
                <TableCell sx={{ fontSize: 14, fontFamily: "Source Sans Pro", padding: "6px" }}>{ticket.status}</TableCell>
                <TableCell sx={{ fontSize: 14, fontFamily: "Source Sans Pro", padding: "6px" }}>
                  <Tooltip title={renderHoverContent()} arrow interactive>
                    <span
                      style={{
                        color: "#1976d2",
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                      onClick={() => handleFetchCoordinates(ticket.siteId)}
                    >
                      {ticket.siteId}
                    </span>
                  </Tooltip>
                </TableCell>
                <TableCell sx={{ fontSize: 14, fontFamily: "Source Sans Pro", padding: "6px" }}>{ticket.serialNumber}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <CustomPagination
        sx={{ mt: "30px" }}
        totalPages={Math.ceil(totalPages / rowsPerPage)}
        currentPage={page}
      />
    </Box>
  );
};

export default TicketTable;