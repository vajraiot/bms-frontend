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
  IconButton,TableFooter,
  TablePagination,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {last7daysTickets} from "../../services/apiService";
import axios from 'axios';
import Autocomplete from '@mui/material/Autocomplete';
import { AppContext } from "../../services/AppContext";
import { tokens } from "../../theme";


const TicketTable = () => {
  const [siteId, setSiteId] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20); // Changed initial value to 5
  const [tickets, setTickets] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0); // Changed from totalPages to totalRecords
  const [errors, setErrors] = useState({ startDate: false, endDate: false });

  const { siteOptions } = useContext(AppContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const clearOptions = () => {
    setSiteId('');
    setStartDate(null);
    setEndDate(null);
    handleFetchTickets();
  };

  

  const TimeFormat = (dateString) => {
    if (dateString == null) return '';
    const utcDate = new Date(dateString);
    const year = utcDate.getFullYear();
    const month = String(utcDate.getMonth() + 1).padStart(2, '0');
    const day = String(utcDate.getDate()).padStart(2, '0');
    const hours = String(utcDate.getHours()).padStart(2, '0');
    const minutes = String(utcDate.getMinutes()).padStart(2, '0');
    const seconds = String(utcDate.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const fetchTickets = async (currentPage) => {
    if (!startDate || !endDate) {
      console.error('Start date or end date is missing');
      setErrors({ startDate: !startDate, endDate: !endDate });
      return;
    }

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const formattedStartDate = formatDate(new Date(startDate.split('%')[0]));
    const formattedEndDate = formatDate(new Date(endDate.split('%')[0]));

    const url = `${BASE_URL}/tickets?siteId=${siteId}&start=${formattedStartDate}T00:00:00&end=${formattedEndDate}T23:59:59&page=${currentPage}&size=${rowsPerPage}`;

    try {
      setTickets([]);
      setTotalRecords(0);
      const response = await axios.get(url);
      setTickets(response.data.content);
      setTotalRecords(response.data.totalElements);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleFetchTickets = async () => {
    if (startDate && endDate) {
      await fetchTickets(page);
    } else {
      try {
        const response = await last7daysTickets(page, rowsPerPage);
        setTickets(response.content);
        setTotalRecords(response.totalElements);
      } catch (error) {
        console.error('Error fetching last 7 days tickets:', error);
      }
    }
  };
  useEffect(() => {
    handleFetchTickets();
  }, [page, rowsPerPage]); // Added rowsPerPage to dependencies

  const [hoverData, setHoverData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFetchCoordinates = async (siteId) => {
    setHoverData(null);
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/getCoordinates`, {
        params: { siteId, marginMinutes: 15 },
      });
      setHoverData(response.data);
    } catch (error) {
      console.error('Failed to fetch coordinates:', error);
      setHoverData(null);
    } finally {
      setLoading(false);
    }
  };

  const renderHoverContent = () => {
    if (loading) return <CircularProgress size={20} />;
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
          textAlign: 'left',
          maxWidth: 200,
          p: 1,
          border: '1px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
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
          <strong>Status:</strong>{' '}
          {hoverData.statusType === 0 ? 'Inactive' : 'Active'}
        </Typography>
      </Box>
    );
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when rows per page changes
  };

  return (
    <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh', // Ensure the Box takes full viewport height
      padding: 2,
    }}
  >
    {/* Header Section */}
    <Box display="flex" gap={2} mb={2}>
      <Autocomplete
        freeSolo
        options={siteOptions.map((site) => site.siteId)}
        value={siteId}
        onChange={(event, newValue) => setSiteId(newValue || '')}
        filterOptions={(options, { inputValue }) => {
          if (!inputValue) return [];
          if (/^[a-zA-Z]$/.test(inputValue)) return options;
          if (/^\d$/.test(inputValue)) {
            return options.filter((option) => option.includes(inputValue));
          }
          return options.filter((option) =>
            option.toLowerCase().includes(inputValue.toLowerCase())
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Substation ID"
            sx={{
              width: 200,
              height: 30,
              mt: 0.6,
              fontWeight: 'bold',
              '& .MuiInputLabel-root': { fontWeight: 'bold' },
              '& .MuiInputBase-root': { height: 35 },
            }}
          />
        )}
      />
  
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
      />
  
      <TextField
        label="End Date"
        type="date"
        value={endDate?.split('%')[0] || ''}
        onChange={(e) => {
          setEndDate(e.target.value + '%2023:59:59');
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
      />
  
      <IconButton onClick={handleFetchTickets}>
        <SearchIcon />
      </IconButton>
      <Box onClick={clearOptions}>
        <Typography variant="body1" sx={{ marginTop: '8px', fontSize: 15, cursor: 'pointer' }}>
        ❌
        </Typography>
      </Box>
    </Box>
  
    {/* Table Section */}
    <Box
      sx={{
        flex: 1, // Takes remaining space between header and footer
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden', // Prevent overflow from parent
      }}
    >
      <TableContainer
        component={Paper}
        sx={{
          border: '1px solid black',
          borderRadius: '8px 8px 0 0', // Round top corners only
          flex: 1, // Take up remaining space
          overflowY: 'auto', // Enable scrolling
          maxHeight: '60vh', // Set a fixed height for scrolling
        }}
      >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow sx={{ height: '30px' }}>
              {[
    
                'Substation ID',
                'Serial Number',
                'Alarm Name',
                'Raise Time',
                'Close Time',
                'Status',
              ].map((header) => (
                <TableCell
                  key={header}
                  sx={{
                    fontWeight: "bold",
                    background: "linear-gradient(to bottom, #d82b27, #f09819) !important",
                    color: "#ffffff",
                    padding: '3px',
                    minWidth: "150px",
                    whiteSpace: "nowrap",
                    textAlign: "center"
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id} sx={{ height: '30px' }}>
                <TableCell sx={{ fontSize: 14, fontFamily: 'Source Sans Pro', padding: '6px' ,textAlign:"center"}}>
                  <Tooltip title={renderHoverContent()} arrow interactive>
                    <span
                      style={{
                        color: '#1976d2',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        
                      }}
                      onClick={() => handleFetchCoordinates(ticket.siteId)}
                    >
                      {ticket.siteId}
                    </span>
                  </Tooltip>
                </TableCell>
                <TableCell sx={{ fontSize: 14, fontFamily: 'Source Sans Pro', padding: '6px' ,textAlign:"center"}}>
                  {ticket.serialNumber}
                </TableCell>
                <TableCell sx={{ fontSize: 14, fontFamily: 'Source Sans Pro', padding: '6px' ,textAlign:"center"}}>
                  {ticket.message}
                </TableCell>
                <TableCell sx={{ fontSize: 14, fontFamily: 'Source Sans Pro', padding: '6px' ,textAlign:"center"}}>
                  {TimeFormat(ticket.raiseTime)}
                </TableCell>
                <TableCell sx={{ fontSize: 14, fontFamily: 'Source Sans Pro', padding: '6px',textAlign:"center" }}>
                  {TimeFormat(ticket.closeTime)}
                </TableCell>
                <TableCell sx={{ fontSize: 14, fontFamily: 'Source Sans Pro', padding: '6px' ,textAlign:"center"}}>
                  {ticket.status}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
  
      {/* Footer Section */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 20, 50]}
        count={totalRecords}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          '& .MuiTablePagination-toolbar': {
            background: 'linear-gradient(to bottom, #d82b27, #f09819)',
            color: 'white',
            borderRadius: '0 0 8px 8px',
            padding: '8px',
          },
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
            fontWeight: 'bold',
            color: 'white',
          },
          '& .MuiTablePagination-actions': {
            color: 'white',
          },
          '& .MuiIconButton-root': {
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          },
          border: '1px solid black',
          borderTop: 'none',
        }}
      />
    </Box>
  </Box>
  );
};

export default TicketTable;