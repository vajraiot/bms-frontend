import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Typography,
  TextField,
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
  TableFooter,
  TablePagination,
  Stack,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import Autocomplete from '@mui/material/Autocomplete';
import { AppContext } from "../../services/AppContext";
import { tokens } from "../../theme";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import GridOnIcon from '@mui/icons-material/GridOn';

const BASE_URL = "http://122.175.45.16:51270"; 
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

const TicketTable = () => {
  const [siteId, setSiteId] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [tickets, setTickets] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [errors, setErrors] = useState({ startDate: false, endDate: false });
  const [isFiltered, setIsFiltered] = useState(false); // Track if filters are applied

  const { siteOptions } = useContext(AppContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const clearOptions = () => {
    setSiteId('');
    setStartDate(null);
    setEndDate(null);
    setPage(0);
    setIsFiltered(false);
    last7daysTickets(0);
  };

  const handleExportPdf = async () => {
    try {
      const formattedStartDate = startDate ? formatDate(new Date(startDate.split('%')[0])) : '';
      const formattedEndDate = endDate ? formatDate(new Date(endDate.split('%')[0])) : '';
      const url = `/tickets/download/pdf?siteId=${siteId}&start=${formattedStartDate}T00:00:00&end=${formattedEndDate}T23:59:59`;
  
      const response = await apiClient.get(url, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `tickets_${formattedStartDate}_to_${formattedEndDate}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error exporting PDF:', error.response ? error.response.data : error.message);
    }
  };

  const handleExportExcel = async () => {
    try {
      const formattedStartDate = startDate ? formatDate(new Date(startDate.split('%')[0])) : '';
      const formattedEndDate = endDate ? formatDate(new Date(endDate.split('%')[0])) : '';
      const url = `/tickets/download/excel?siteId=${siteId}&start=${formattedStartDate}T00:00:00&end=${formattedEndDate}T23:59:59`;
  
      const response = await apiClient.get(url, {
        responseType: 'blob',
      });
  
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `tickets_${formattedStartDate}_to_${formattedEndDate}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error exporting Excel:', error.response ? error.response.data : error.message);
    }
  };

  const last7daysTickets = async (currentPage) => {
    try {
      const response = await apiClient.get(
        `${BASE_URL}/latest7days?page=${currentPage}&size=${rowsPerPage}`
      );
      setTickets(response.data.content);
      setTotalRecords(response.data.totalElements);
    } catch (error) {
      console.error('Error fetching last 7 days data:', error);
    }
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

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const fetchTickets = async (currentPage) => {
    if (!startDate || !endDate) {
      console.error('Start date or end date is missing');
      setErrors({ startDate: !startDate, endDate: !endDate });
      return;
    }
    const formattedStartDate = formatDate(new Date(startDate.split("%")[0]));
    const formattedEndDate = formatDate(new Date(endDate.split("%")[0]));
    const url = `${BASE_URL}/tickets?siteId=${siteId}&start=${formattedStartDate}T00:00:00&end=${formattedEndDate}T23:59:59&page=${currentPage}&size=${rowsPerPage}`;
    try {
      setTickets([]);
      setTotalRecords(0);
      const response = await apiClient.get(url);
      setTickets(response.data.content);
      setTotalRecords(response.data.totalElements);
    } catch (error) {
      console.error('Error fetching filtered data:', error.response ? error.response.data : error.message);
    }
  };

  const handleFetchTickets = () => {
    if (siteId && startDate && endDate) {
      setPage(0); // Reset to first page when fetching new filtered data
      setIsFiltered(true); // Mark as filtered
      fetchTickets(0);
    }
  };

  useEffect(() => {
    if (isFiltered && siteId && startDate && endDate) {
      fetchTickets(page); // Fetch filtered tickets when page or rowsPerPage changes
    } else {
      last7daysTickets(page); // Fetch last 7 days when no filters are applied
    }
  }, [page, rowsPerPage, isFiltered]);

  const [hoverData, setHoverData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFetchCoordinates = async (siteId) => {
    setHoverData(null);
    setLoading(true);
    try {
      const response = await apiClient.get(`${BASE_URL}/api/getCoordinates`, {
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
    setPage(0);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        padding: 2,
      }}
    >
      {/* Header Section */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        {/* Left Side: Inputs */}
        <Box display="flex" gap={2}>
          <Autocomplete
            freeSolo
            options={siteOptions.map((site) => site.siteId)}
            value={siteId}
            onChange={(event, newValue) => setSiteId(newValue || '')}
            filterOptions={(options, { inputValue }) => {
              if (!inputValue) return [];
              const lowerInput = inputValue.toLowerCase();
              return options.filter((option) =>
                option.toLowerCase().startsWith(lowerInput)
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
          <IconButton onClick={handleFetchTickets} disabled={!siteId || !startDate || !endDate}>
            <SearchIcon />
          </IconButton>
          <Box onClick={clearOptions}>
            <Typography variant="body1" sx={{ marginTop: '8px', fontSize: 15, cursor: 'pointer' }}>
              ❌
            </Typography>
          </Box>
        </Box>

        {/* Right Side: Export Buttons */}
        <Stack direction="row" spacing={1}>
          <Tooltip title="Export to PDF">
            <IconButton
              onClick={handleExportPdf}
              disabled={!siteId || !startDate || !endDate}
              sx={{
                backgroundColor: '#f44336',
                color: 'white',
                '&:hover': { backgroundColor: '#d32f2f' },
                '&.Mui-disabled': { backgroundColor: '#f44336', opacity: 0.5 },
              }}
            >
              <PictureAsPdfIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export to Excel">
            <IconButton
              onClick={handleExportExcel}
              disabled={!siteId || !startDate || !endDate}
              sx={{
                backgroundColor: '#4caf50',
                color: 'white',
                '&:hover': { backgroundColor: '#388e3c' },
                '&.Mui-disabled': { backgroundColor: '#4caf50', opacity: 0.5 },
              }}
            >
              <GridOnIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      {/* Table Section */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <TableContainer
          component={Paper}
          sx={{
            border: '1px solid black',
            borderRadius: '8px 8px 0 0',
            flex: 1,
            overflowY: 'auto',
            maxHeight: '60vh',
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
                      textAlign: "center",
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
                  <TableCell sx={{ fontSize: 14, fontFamily: 'Source Sans Pro', padding: '6px', textAlign: "center" }}>
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
                  <TableCell sx={{ fontSize: 14, fontFamily: 'Source Sans Pro', padding: '6px', textAlign: "center" }}>
                    {ticket.serialNumber}
                  </TableCell>
                  <TableCell sx={{ fontSize: 14, fontFamily: 'Source Sans Pro', padding: '6px', textAlign: "center" }}>
                    {ticket.message}
                  </TableCell>
                  <TableCell sx={{ fontSize: 14, fontFamily: 'Source Sans Pro', padding: '6px', textAlign: "center" }}>
                    {TimeFormat(ticket.raiseTime)}
                  </TableCell>
                  <TableCell sx={{ fontSize: 14, fontFamily: 'Source Sans Pro', padding: '6px', textAlign: "center" }}>
                    {TimeFormat(ticket.closeTime)}
                  </TableCell>
                  <TableCell sx={{ fontSize: 14, fontFamily: 'Source Sans Pro', padding: '6px', textAlign: "center" }}>
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