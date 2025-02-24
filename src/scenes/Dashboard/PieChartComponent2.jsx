import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow,TablePagination, Paper,  Button,IconButton 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const PieChartComponent2 = ({ data1, handlePieClickCommu }) => {
  const [clickedSection, setClickedSection] = useState(null);
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const outerRadius = 85;
  const innerRadius = 30;
  const chartSize = 220;
  const API_URL = "http://122.175.45.16:51270/getCommnStatus?marginMinutes=1";

  // Function to fetch data from backend
  const fetchCommunicationStatus = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching communication status:", error);
      return [];
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle Pie Click
  const handleClick = async (data, index) => {
    setClickedSection(data.name);
    setIsTableVisible(true);

    // Fetch Data for Selected Section
    try {
      const response = await fetchCommunicationStatus();

      // Filter data based on the clicked section
      const filteredData = response.filter(item => {
        if (data.name === 'Communicating') {
          return item.statusType === 1; // Only communicating devices (statusType = 1)
        } else if (data.name === 'Non-Communicating') {
          return item.statusType === 0; // Only non-communicating devices (statusType = 0)
        }
        return false;
      }).map((item) => ({
        siteId: item?.siteId || '--',
        statusType: item?.statusType === 1 ? 'Communicating' : 'Non-Communicating',
        vendor: item?.siteLocationDTO?.vendorName || '--',
        location: item?.siteLocationDTO?.area || '--',
        cellsConnectedCount: item?.generalDataDTO?.deviceDataDTO?.[0]?.cellsConnectedCount || 0,
        stringVoltage: item?.generalDataDTO?.deviceDataDTO?.[0]?.stringvoltage || 0,
        instantaneousCurrent: item?.generalDataDTO?.deviceDataDTO?.[0]?.instantaneousCurrent || 0,
        ambientTemperature: item?.generalDataDTO?.deviceDataDTO?.[0]?.ambientTemperature || 0,
        batteryRunHours: item?.generalDataDTO?.deviceDataDTO?.[0]?.batteryRunHours || 0,
      }));

      setTableData(filteredData);
    } catch (error) {
      console.error("Error processing data:", error);
      setTableData([]);
    }

    if (handlePieClickCommu) {
      handlePieClickCommu(data, index);
    }
  };

  // Close Table
  const handleCloseTable = () => {
    setIsTableVisible(false);
  };

  // Render Table
  const renderTable = () => {
    if (!isTableVisible || !clickedSection) return null;

    return (
      <Box
        sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
          backgroundColor: 'white',
          boxShadow: 3,
          borderRadius: 2,
          p: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(90deg, rgb(0, 212, 255) 0%, rgb(9, 9, 121) 35%, rgb(0, 212, 255) 100%)',
            color: 'white',
            borderRadius: '4px',
            padding: '10px',
            mb: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {clickedSection} Devices
          </Typography>
        </Box>
    
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'rgb(216, 43, 39)' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Site ID</TableCell>
                {/* <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell> */}
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Vendor</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Location</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Cells Connected</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>String Voltage</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Instantaneous Current</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Ambient Temperature</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Battery Run Hours</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.siteId}</TableCell>
                  {/* <TableCell>{row.statusType}</TableCell> */}
                  <TableCell>{row.vendor}</TableCell>
                  <TableCell>{row.location}</TableCell>
                  <TableCell>{row.cellsConnectedCount}</TableCell>
                  <TableCell>{row.stringVoltage}</TableCell>
                  <TableCell>{row.instantaneousCurrent}</TableCell>
                  <TableCell>{row.ambientTemperature}</TableCell>
                  <TableCell>{row.batteryRunHours}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={tableData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Close Button */}
      <Box display="flex" justifyContent="flex-end" mt={2}>
  <Button
    variant="contained"
    onClick={handleCloseTable}
    sx={{
      backgroundColor: 'rgb(216, 43, 39)',
      '&:hover': { backgroundColor: 'rgb(180, 30, 28)' }, // Darker shade on hover
    }}
  >
    Close
  </Button>
      </Box>
      </Box>
    );
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
      <Box display="flex" justifyContent="center" alignItems="center">
        <PieChart width={chartSize} height={chartSize}>
          <defs>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="rgba(0, 0, 0, 0.7)" />
            </filter>
            <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0d900b" />
              <stop offset="50%" stopColor="#02DEB2" />
              <stop offset="100%" stopColor="#62B816" />
            </linearGradient>
            <linearGradient id="notcommuGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e41c38" />
              <stop offset="100%" stopColor="#F71735" />
            </linearGradient>
          </defs>

          <Pie
            data={data1}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            paddingAngle="5"
            cornerRadius="5"
            outerRadius={outerRadius}
            label
            onClick={handleClick}
            style={{ filter: 'url(#shadow)' }}
          >
            {data1.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index === 0 ? 'url(#greenGradient)' : 'url(#notcommuGradient)'}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>

        {/* Legend Section */}
        <Box ml={2} display="flex" flexDirection="column" justifyContent="center">
          {data1.map((entry, index) => (
            <Box key={index} display="flex" alignItems="center" mb={1}>
              <Box
                width={10}
                height={10}
                borderRadius="50%"
                mr={1}
                style={{
                  background: `linear-gradient(to right, ${
                    index === 0 ? '#0d900b, #02DEB2,#62B816' : '#e41c38, #F71735'
                  })`,
                }}
              />
              <Typography variant="body2" style={{ fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' }}>
                {entry.name}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Render Table */}
      {renderTable()}
    </Box>
  );
};

export default PieChartComponent2;