// src/components/PieChartComponent2.js
import React, { useState, useContext } from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { formatToTime } from "../../services/AppContext";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, Paper, Button, Dialog,
  DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { AppContext } from "../../services/AppContext";
import { useNavigate } from "react-router-dom";
import { fetchCommunicationStatus } from '../../services/apiService';

const PieChartComponent2 = ({ data1, handlePieClickCommu }) => {
  const { setSiteId, setSerialNumber, handleSearch ,marginMinutes} = useContext(AppContext);
  const [clickedSection, setClickedSection] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();

  // Constants
  const CHART_SIZE = 220;
  const OUTER_RADIUS = 80;
  const INNER_RADIUS = 25;
  const TITLE_GRADIENT = 'linear-gradient(90deg, rgb(0, 212, 255) 0%, rgb(9, 9, 121) 35%, rgb(0, 212, 255) 100%)';
  const HEADER_GRADIENT = 'linear-gradient(to bottom, #d82b27, #f09819)';
  const BUTTON_COLOR = 'rgb(216, 43, 39)';
  const BUTTON_HOVER_COLOR = 'rgb(180, 30, 28)';

  const TABLE_HEADERS = [
    "Substation ID", "Serial Number", "Vendor", "Location", "Cells Connected",
    "String Voltage", "Instantaneous Current", "Ambient Temperature", "Battery Run Hours"
  ];

  const TABLE_CELL_STYLE = {
    color: 'white',
    fontWeight: 'bold',
    background: HEADER_GRADIENT,
    padding: '3px',
    minWidth: '150px',
    whiteSpace: 'nowrap',
    textAlign: 'center'
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Pie chart click handler
  const handleClick = async (data, index) => {
    setClickedSection(data.name);
    setIsDialogOpen(true);

    try {
      const response = await fetchCommunicationStatus(marginMinutes);
      const filteredData = response
        .filter(item => data.name === 'Communicating' ? item.statusType === 1 : item.statusType === 0)
        .map(item => ({
          siteId: item?.siteId || '--',
          serialNumber: item?.generalDataDTO?.deviceDataDTO[0]?.serialNumber || 'N/A',
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

    handlePieClickCommu?.(data, index);
  };

  // Row click handler
  const handleRowClick = async (item) => {
    setSiteId(item.siteId);
    setSerialNumber(item.serialNumber);
    const data = await handleSearch();
    if (data) navigate("/livemonitoring", { state: { from: '/' } });
  };

  const handleCloseDialog = () => setIsDialogOpen(false);

  const renderDialog = () => (
    <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: TITLE_GRADIENT, color: 'white', borderRadius: '4px', padding: '10px' }}>
          <Typography variant="h6">{clickedSection} Devices</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {TABLE_HEADERS.map((header, index) => (
                  <TableCell key={index} sx={TABLE_CELL_STYLE}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <span
                      style={{
                        color: "#1976d2",
                        textDecoration: "underline",
                        cursor: "pointer",
                        border: "2px solid #ccc",
                        padding: "3px",
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                        textAlign: "center",
                      }}
                      title="Double tap here"
                      onClick={() => handleRowClick(row)}
                    >
                      {row.siteId}
                    </span>
                  </TableCell>
                  <TableCell style={{ padding: "3px", fontWeight: "bold", whiteSpace: "nowrap", textAlign: "center" }}>{row.serialNumber}</TableCell>
                  <TableCell style={{ padding: "3px", fontWeight: "bold", whiteSpace: "nowrap", textAlign: "center" }}>{row.vendor}</TableCell>
                  <TableCell style={{ padding: "3px", fontWeight: "bold", whiteSpace: "nowrap", textAlign: "center" }}>{row.location}</TableCell>
                  <TableCell style={{ padding: "3px", fontWeight: "bold", whiteSpace: "nowrap", textAlign: "center" }}>{row.cellsConnectedCount}</TableCell>
                  <TableCell style={{ padding: "3px", fontWeight: "bold", whiteSpace: "nowrap", textAlign: "center" }}>{row.stringVoltage} V</TableCell>
                  <TableCell style={{ padding: "3px", fontWeight: "bold", whiteSpace: "nowrap", textAlign: "center" }}>{row.instantaneousCurrent} A</TableCell>
                  <TableCell style={{ padding: "3px", fontWeight: "bold", whiteSpace: "nowrap", textAlign: "center" }}>{row.ambientTemperature} °C</TableCell>
                  <TableCell style={{ padding: "3px", fontWeight: "bold", whiteSpace: "nowrap", textAlign: "center" }}>{formatToTime(row.batteryRunHours)}</TableCell>
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
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={handleCloseDialog}
          sx={{ backgroundColor: BUTTON_COLOR, color: 'white', '&:hover': { backgroundColor: BUTTON_HOVER_COLOR } }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box
      border={1}
      borderColor="grey.300"
      borderRadius={2}
      padding="1px 20px 15px 18px"
      boxShadow={3}
      display="flex"
      flexDirection="column"
      alignItems="center"
      height="230px"
      width="fit-content"
    >
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Device Status
      </Typography>
      <Box display="flex" justifyContent="center" alignItems="center" mt={-1}>
        <PieChart width={CHART_SIZE} height={CHART_SIZE}>
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
            innerRadius={INNER_RADIUS}
            paddingAngle={5}
            cornerRadius={5}
            outerRadius={OUTER_RADIUS}
            label
            onClick={handleClick}
            style={{ filter: 'url(#shadow)' }}
          >
            {data1.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index === 0 ? 'url(#greenGradient)' : 'url(#notcommuGradient)'} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>

        <Box ml={2} display="flex" flexDirection="column" justifyContent="center">
          {data1.map((entry, index) => (
            <Box key={index} display="flex" alignItems="center" mb={1}>
              <Box
                width={10}
                height={10}
                borderRadius="50%"
                mr={1}
                sx={{ background: `linear-gradient(to right, ${index === 0 ? '#0d900b, #02DEB2, #62B816' : '#e41c38, #F71735'})` }}
              />
              <Typography variant="body2" sx={{ fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' }}>
                {entry.name}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {renderDialog()}
    </Box>
  );
};

export default PieChartComponent2;