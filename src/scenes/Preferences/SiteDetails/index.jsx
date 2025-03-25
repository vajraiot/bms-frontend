import React, { useState, useEffect, useContext } from 'react';
import axios from "axios";
import {fetchStatesDetails, fetchCirclesDetails, fetchAreasDetails, fetchSiteDetailsBatteryandChargerdetails, updateSiteLocation, addSiteLocation, deleteSite } from '../../../services/apiService';
import {
  Grid,
  Typography,
  TextField,
  Button,
  Box,
  Autocomplete,
  FormControl,Snackbar, Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import SearchAndAddButtons from '../SearchAndAddButtons/index';
import { AppContext } from "../../../services/AppContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
const BASE_URL = "http://localhost:51270";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add JWT token to every request via interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const columnMappingsPart1 = {
  siteId: 'Substation ID',
  vendorName: 'Customer',
  latitude: 'Latitude',
  longitude: 'Longitude',
  state: 'State Name',
  circle: 'Circle Name',
  area: 'Area Name',
  // batteryAHCapacity: 'Battery AH Capacity',
};

const columnMappingsPart2 = {
  serialNumber:'Serial Number',
  firstUsedDate: 'First Used Date',
  batterySerialNumber: 'Battery Serial Number',
  batteryBankType: 'Battery Bank Type',
  manufacturerName: 'Manufacturer Name',
  designVoltage: 'Design Voltage',
  ahCapacity:'Ah capacity',
 
};

const columnMappingsPart3 = {
  // individualCellVoltage: 'Individual Cell Voltage',
  highVoltage: 'High Voltage',
  lowVoltage: 'Low Voltage',
  batteryAboutToDie: 'Battery About To Die',
  openBattery: 'Open Battery',
  highTemperature: 'High Temperature',
  // lowTemperature: 'Low Temperature',
  // notCommnVoltage: 'Not Communicating Voltage',
  // notCommnTemperature: 'Not Communicating Temperature',
};

const SiteLocation = () => {
  const [openNoDataDialog, setOpenNoDataDialog] = useState(false);
  const [siteDetails, setSiteDetails] = useState([]);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({}); 
  const [stateOptions, setStateOptions] = useState([]); // Options for state
  const [circleOptions, setCircleOptions] = useState([]); // Options for circle
  const [areaOptions, setAreaOptions] = useState([]); 
  const [searchData, setSearchData] = useState({
    siteId: '',
    serialNumber: '',
  });
  const {
    siteOptions,
    serialNumberOptions,
    siteId,
    serialNumber,
    setSiteId,
    setSerialNumber,
    setData
  } = useContext(AppContext);

  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setSiteId("");
        setSerialNumber("");
        const statesData = await fetchStatesDetails();
        console.log("States Data:", statesData); // Debugging: Log the API response
        setStateOptions(statesData);
      } catch (error) {
        console.error('Error fetching site details:', error);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    console.log('Updated formData:', formData);
  }, [formData]); // This runs whenever formData changes
  
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  const handleStateChange = (event, newValue) => {
    setCircleOptions([]);
    const state= stateOptions.find((state) => state.name === newValue); 
    setCircleOptions(state?.circles || []);
};

const handleCircleChange = (event, newValue) => {
  const circle= circleOptions.find((circle) => circle.name === newValue);
  setAreaOptions(circle?.areas || []);
};

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchData({
      ...searchData,
      [name]: value,
    });
  };

  const handleGetDetails = async () => {
    try {
      if (!siteId || !serialNumber) {
        console.error('SiteId or SerialNumber is empty!');
        return;
      }
  
      const response = await fetchSiteDetailsBatteryandChargerdetails(siteId, serialNumber);
  
      // Check if the response has a 400 status code
      if (response?.status === 400) {
        setOpenNoDataDialog(true); // Open the "No Data" dialog
        setFormData({}); // Clear form data
      } else if (response?.data) {
        const siteData = response.data;
        const combinedData = {
          state: siteData.state || '',
          circle: siteData.circle || '',
          area: siteData.area || '',
          latitude: siteData.latitude || '',
          longitude: siteData.longitude || '',
          vendorName: siteData.vendorName || '',
          batteryAHCapacity: siteData.batteryAHCapacity || '',
          siteId: siteData.siteId || '',
          serialNumber: siteData.manufacturerDTO?.serialNumber || 'N/A',
          firstUsedDate: siteData.manufacturerDTO?.firstUsedDate || '',
          batterySerialNumber: siteData.manufacturerDTO?.batterySerialNumber || 'N/A',
          batteryBankType: siteData.manufacturerDTO?.batteryBankType || 'N/A',
          ahCapacity: siteData.manufacturerDTO?.ahCapacity || 'N/A',
          manufacturerName: siteData.manufacturerDTO?.manufacturerName || 'N/A',
          individualCellVoltage: siteData.manufacturerDTO?.individualCellVoltage || 'N/A',
          designVoltage: siteData.manufacturerDTO?.designVoltage || 'N/A',
          highVoltage: siteData.manufacturerDTO?.highVoltage || 'N/A',
          lowVoltage: siteData.manufacturerDTO?.lowVoltage || 'N/A',
          batteryAboutToDie: siteData.manufacturerDTO?.batteryAboutToDie || 'N/A',
          openBattery: siteData.manufacturerDTO?.openBattery || 'N/A',
          highTemperature: siteData.manufacturerDTO?.highTemperature || 'N/A',
          lowTemperature: siteData.manufacturerDTO?.lowTemperature || 'N/A',
          notCommnVoltage: siteData.manufacturerDTO?.notCommnVoltage || 'N/A',
          notCommnTemperature: siteData.manufacturerDTO?.notCommnTemperature || 'N/A',
        };
        setFormData(combinedData);
      }
    } catch (error) {
      console.error('Error fetching site details:', error);
  
      // Handle 400 status code from the error response
      if (error.response?.status === 400) {
        setOpenNoDataDialog(true); // Open the "No Data" dialog
        setFormData({}); // Clear form data
      }
    }
  };

  // Close the "No Data" dialog
  const handleCloseNoDataDialog = () => {
    setOpenNoDataDialog(false);
  };
  
  

  const handleEdit = () => setIsEditing(!isEditing);

  const handleAdd = () => {
    if (isAdding) {
      // Cancel Add: Reset form and exit Add mode
      setIsAdding(false);
      setFormData({}); // Reset form data (or restore previous data if needed)
    } else {
      // Start Add: Enable Add mode and clear form
      setIsAdding(true);
      setFormData({}); // Clear form for a new entry
    }
  };
  const validateForm = () => {
    const newErrors = {};
  
    // Custom validation logic
    if (formData.highVoltage && (formData.highVoltage < 2 || formData.highVoltage > 2.5)) {
      newErrors.highVoltage = 'High Voltage must be between 2 and 2.5';
    }
    if (formData.lowVoltage && (formData.lowVoltage < 1.9 || formData.lowVoltage > 2)) {
      newErrors.lowVoltage = 'Low Voltage must be between 1.9 and 2';
    }
    if (formData.batteryAboutToDie && (formData.batteryAboutToDie < 1.8 || formData.batteryAboutToDie > 1.9)) {
      newErrors.batteryAboutToDie = 'Battery About To Die must be between 1.8 and 1.9';
    }
    if (formData.openBattery && (formData.openBattery < 1.4 || formData.openBattery > 1.8)) {
      newErrors.openBattery = 'Open Battery must be between 1.4 and 1.8';
    }
    if (formData.highTemperature && formData.highTemperature > 100) {
      newErrors.highTemperature = 'High Temperature must not exceed 100';
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };
  const handleUpdate = async () => {
    if (!validateForm()) {
      setSnackbarMessage('Please fix the validation errors before submitting.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
  
    try {
      const combinedData = {
        state: formData?.state || '',
        circle: formData?.circle || '',
        area: formData?.area || '',
        latitude: formData?.latitude || '',
        longitude: formData?.longitude || '',
        vendorName: formData?.vendorName || '',
        batteryAHCapacity: formData?.batteryAHCapacity || '',
        siteId: formData?.siteId || '',
        manufacturerDTO: {
          serialNumber: formData?.serialNumber || 'N/A',
          firstUsedDate: formData?.firstUsedDate || 'N/A',
          batterySerialNumber: formData?.batterySerialNumber || 'N/A',
          batteryBankType: formData?.batteryBankType || 'N/A',
          ahCapacity: formData?.ahCapacity || 'N/A',
          manufacturerName: formData?.manufacturerName || 'N/A',
          individualCellVoltage: formData?.individualCellVoltage || 'N/A',
          designVoltage: formData?.designVoltage || 'N/A',
          highVoltage: formData?.highVoltage || 'N/A',
          lowVoltage: formData?.lowVoltage || 'N/A',
          batteryAboutToDie: formData?.batteryAboutToDie || 'N/A',
          openBattery: formData?.openBattery || 'N/A',
          highTemperature: formData?.highTemperature || 'N/A',
          lowTemperature: formData?.lowTemperature || 'N/A',
          notCommnVoltage: formData?.notCommnVoltage || 'N/A',
          notCommnTemperature: formData?.notCommnTemperature || 'N/A',
        },
      };

      const response = await apiClient.put(`${BASE_URL}/api/updateSiteLocationToSiteId`, combinedData);

      // Show success Snackbar
      setSnackbarMessage('Updated successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error('Error updating site details:', error);

      // Show error Snackbar
      setSnackbarMessage('Failed to update site details.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Handle Snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };



const handleAddSite = async () => {
  if (!validateForm()) {
    setSnackbarMessage('Please fix the validation errors before submitting.');
    setSnackbarSeverity('error');
    setSnackbarOpen(true);
    return;
  }

  try {
    // Validate required fields
    if (!formData.siteId || !formData.serialNumber) {
      alert('Site ID and Serial Number are required.');
      return;
    }

    const combinedData = {
      state: formData?.state || '',
      circle: formData?.circle || '',
      area: formData?.area || '',
      latitude: formData?.latitude || '',
      longitude: formData?.longitude || '',
      vendorName: formData?.vendorName || '',
      batteryAHCapacity: formData?.batteryAHCapacity || '',
      siteId: formData.siteId,
      manufacturerDTO: {
        serialNumber: formData.serialNumber,
        firstUsedDate: formData?.firstUsedDate || '',
        batterySerialNumber: formData?.batterySerialNumber || '',
        batteryBankType: formData?.batteryBankType || '',
        ahCapacity: formData?.ahCapacity || '',
        manufacturerName: formData?.manufacturerName || '',
        individualCellVoltage: formData?.individualCellVoltage || '',
        designVoltage: formData?.designVoltage || '',
        highVoltage: formData?.highVoltage || '',
        lowVoltage: formData?.lowVoltage || '',
        batteryAboutToDie: formData?.batteryAboutToDie || '',
        openBattery: formData?.openBattery || '',
        highTemperature: formData?.highTemperature || '',
        lowTemperature: formData?.lowTemperature || '',
        notCommnVoltage: formData?.notCommnVoltage || '',
        notCommnTemperature: formData?.notCommnTemperature || '',
      }
    };

    const response = await axios.post(
      `${BASE_URL}/api/postAddNewLocationToSiteId`,
      combinedData,
      { headers: { 'Content-Type': 'application/json' } }
    );

    alert('Site added successfully!');
    setIsAdding(false);
  } catch (error) {
    if (error.response) {
      console.error('Server response error:', error.response.data);
      alert(`Error: ${error.response.data.message || 'Unknown server error'}`);
    } else {
      console.error('Unexpected error:', error.message);
      alert('Unexpected error occurred while adding the site.');
    }
  }
};


const handleDeleteSite = async () => {
  if (!siteId || !serialNumber) {
    toast.error('Please select both Substation ID and Serial Number to delete the site.');
    return;
  }

  try {
    await deleteSite(siteId, serialNumber);
    toast.success('Site deleted successfully!');
    setFormData({});
  } catch (error) {
    console.error('Error deleting site:', error);
    toast.error('Failed to delete site. Please try again.');
  }
};
  useEffect(() => {
    console.log('Updated formData:', formData); // This will log each time formData updates
  }, [formData]);
const renderFormFields = (columns) => {
  // Separate states for "Other" selection and custom input
   const [isOtherSelected, setIsOtherSelected] = React.useState({
    state: false,
    circle: false,
    area: false,
   });
  const [otherValues, setOtherValues] = React.useState({
    state: '',
    circle: '',
    area: '',
  });
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    let error = '';
  
    // Custom validation logic
    if (name === 'highVoltage' && (value < 2 || value > 2.5)) {
      error = 'High Voltage must be between 2 and 2.5';
    } else if (name === 'lowVoltage' && (value < 1.9 || value > 2)) {
      error = 'Low Voltage must be between 1.9 and 2';
    } else if (name === 'batteryAboutToDie' && (value < 1.8 || value > 1.9)) {
      error = 'Battery About To Die must be between 1.8 and 1.9';
    } else if (name === 'openBattery' && (value < 1.4 || value > 1.8)) {
      error = 'Open Battery must be between 1.4 and 1.8';
    } else if (name === 'highTemperature' && value > 100) {
      error = 'High Temperature must not exceed 100';
    }
  
    // Update form data
    setFormData({
      ...formData,
      [name]: value,
    });
  
    // Update errors
    setErrors({
      ...errors,
      [name]: error,
    });
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Grid container spacing={2}>
        {Object.keys(columns).map((key) => {
          if (key === 'siteId') {
            return (
              <Grid item xs={12} sm={8} md={4} lg={3} key="siteId">
                <Box width="150px" textAlign="center">
                  <FormControl fullWidth margin="dense">
                    <Autocomplete
                      options={siteOptions.map((site) => site.siteId)}
                      value={formData.siteId || ''}
                      onChange={(event, newValue) => {
                        setSiteId(newValue);
                        handleInputChange({
                          target: {
                            name: 'siteId',
                            value: newValue,
                          },
                        });
                      }}
                      disabled={!isEditing && !isAdding}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Substation ID"
                          InputLabelProps={{
                            sx: {
                              fontWeight: "bold",
                              color: "black",
                            },
                          }}
                          inputProps={{
                            ...params.inputProps,
                            style: { textAlign: 'center' },
                          }}
                          sx={{
                            '& .MuiInputBase-root': {
                              height: '35px',
                              backgroundColor: (!isEditing && !isAdding) ? '#f5f5f5' : 'inherit',
                            },
                            '& .MuiInputBase-input': {
                              padding: '5px 10px',
                              fontSize: '12px',
                              fontWeight: (!isEditing && !isAdding) ? 'bold' : 'normal',
                              color: (!isEditing && !isAdding) ? '#000' : 'inherit',
                              WebkitTextFillColor: (!isEditing && !isAdding) ? 'black' : 'inherit',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#d3d3d3',
                            },
                            '& .Mui-disabled': {
                              backgroundColor: '#f5f5f5',
                              color: '#000000',
                            },
                          }}
                        />
                      )}
                    />
                  </FormControl>
                </Box>
              </Grid>
            );
          }

          if (key === 'serialNumber') {
            return (
              <Grid item xs={12} sm={8} md={4} lg={3} key="serialNumber">
                <Box width="150px">
                  <FormControl fullWidth margin="dense">
                    <Autocomplete
                      options={serialNumberOptions}
                      getOptionLabel={(option) => option || ''}
                      value={formData.serialNumber || ''}
                      onChange={(event, newValue) => {
                        handleInputChange({
                          target: {
                            name: 'serialNumber',
                            value: newValue || '',
                          },
                        });
                      }}
                      disabled={!isEditing && !isAdding}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Serial Number"
                          InputLabelProps={{
                            sx: {
                              fontWeight: "bold",
                              color: "black",
                            },
                          }}
                          inputProps={{
                            ...params.inputProps,
                            style: { textAlign: 'center' },
                          }}
                          sx={{
                            '& .MuiInputBase-root': {
                              height: '35px',
                              backgroundColor: (!isEditing && !isAdding) ? '#f5f5f5' : 'inherit',
                            },
                            '& .MuiInputBase-input': {
                              padding: '5px 10px',
                              fontSize: '12px',
                              fontWeight: (!isEditing && !isAdding) ? 'bold' : 'normal',
                              color: (!isEditing && !isAdding) ? '#000' : 'inherit',
                              WebkitTextFillColor: (!isEditing && !isAdding) ? 'black' : 'inherit',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#d3d3d3',
                            },
                            '& .Mui-disabled': {
                              backgroundColor: '#f5f5f5',
                              color: '#000000',
                            },
                          }}
                        />
                      )}
                    />
                  </FormControl>
                </Box>
              </Grid>
            );
          }

          if (key === 'state' || key === 'circle' || key === 'area') {
            const options = key === 'state' ? stateOptions : key === 'circle' ? circleOptions : areaOptions;
            const optionsList = options.map((item) => item.name);

            return (
              <Grid item xs={12} sm={8} md={4} lg={3} key={key}>
                <Box width="150px">
                  <FormControl fullWidth margin="dense">
                    <Autocomplete
                      options={[...optionsList, 'Other']}
                      getOptionLabel={(option) => option || ''}
                      value={formData[key] || ''}
                      onChange={(event, newValue) => {
                        if (newValue === 'Other') {
                          // Set "Other" as selected for this field
                          setIsOtherSelected((prev) => ({
                            ...prev,
                            [key]: true,
                          }));
                          setOtherValues((prev) => ({
                            ...prev,
                            [key]: '',
                          }));
                          handleInputChange({
                            target: {
                              name: key,
                              value: '',
                            },
                          });
                        } else {
                          // Reset "Other" selection for this field
                          setIsOtherSelected((prev) => ({
                            ...prev,
                            [key]: false,
                          }));
                          if(key === 'state') {
                          handleStateChange(event, newValue);}
                          if(key === 'circle') {
                          handleCircleChange(event, newValue);}
                          handleInputChange({
                            target: {
                              name: key,
                              value: newValue || '',
                            },
                          });
                        }
                      }}
                      disabled={!isEditing && !isAdding}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={columns[key]}
                          InputLabelProps={{
                            sx: {
                              fontWeight: "bold",
                              color: "black",
                            },
                          }}
                          inputProps={{
                            ...params.inputProps,
                            style: { textAlign: 'center' },
                          }}
                          sx={{
                            '& .MuiInputBase-root': {
                              height: '35px',
                              backgroundColor: (!isEditing && !isAdding) ? '#f5f5f5' : 'inherit',
                            },
                            '& .MuiInputBase-input': {
                              padding: '5px 10px',
                              fontSize: '12px',
                              fontWeight: (!isEditing && !isAdding) ? 'bold' : 'normal',
                              color: (!isEditing && !isAdding) ? '#000' : 'inherit',
                              WebkitTextFillColor: (!isEditing && !isAdding) ? 'black' : 'inherit',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#d3d3d3',
                            },
                            '& .Mui-disabled': {
                              backgroundColor: '#f5f5f5',
                              color: '#000000',
                            },
                          }}
                        />
                      )}
                    />
                    {isOtherSelected[key] && (
                      <TextField
                        label={`Enter ${columns[key]}`}
                        value={otherValues[key]}
                        onChange={(event) => {
                          const value = event.target.value;
                          setOtherValues((prev) => ({
                            ...prev,
                            [key]: value,
                          }));
                          handleInputChange({
                            target: {
                              name: key,
                              value: value,
                            },
                          });
                        }}
                        fullWidth
                        margin="dense"
                        disabled={!isEditing && !isAdding}
                        inputProps={{
                          style: { textAlign: 'center' },
                        }}
                        InputLabelProps={{
                          sx: {
                            fontWeight: "bold",
                            color: "black",
                          },
                        }}
                        sx={{
                          '& .MuiInputBase-root': {
                            height: '35px',
                            fontWeight: (!isEditing && !isAdding) ? 'bold' : 'normal',
                            backgroundColor: (!isEditing && !isAdding) ? '#f0f0f0' : 'transparent',
                          },
                          '& .MuiInputBase-input': {
                            padding: '5px 10px',
                            fontSize: '12px',
                            fontWeight: (!isEditing && !isAdding) ? 'bold' : 'normal',
                            color: (!isEditing && !isAdding) ? '#000' : 'inherit',
                            WebkitTextFillColor: (!isEditing && !isAdding) ? 'black' : 'inherit',
                          },
                          '& .MuiFormLabel-root': {
                            fontSize: '12px',
                          },
                        }}
                      />
                    )}
                  </FormControl>
                </Box>
              </Grid>
            );
          }

          if (key === 'firstUsedDate') {
            return (
              <Grid item xs={12} sm={8} md={4} lg={3} key={key}>
                <Box width="150px">
                  <DatePicker
                    label="First Used Date"
                    value={formData.firstUsedDate ? new Date(formData.firstUsedDate) : null} // Ensure Date object
                    onChange={(newValue) => {
                      handleInputChange({
                        target: {
                          name: 'firstUsedDate',
                          value: newValue, // newValue is already a Date object from DatePicker
                        },
                      });
                    }}
                    
                    disabled={!isEditing && !isAdding}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        margin="dense"
                        inputProps={{
                          style: { textAlign: 'center' },
                        }}
                        InputLabelProps={{
                          sx: {
                            fontWeight: "bold",
                            color: "black",
                          },
                        }}
                        sx={{
                          '& .MuiInputBase-root': {
                            height: '35px',
                            backgroundColor: (!isEditing && !isAdding) ? '#f5f5f5' : 'inherit',
                          },
                          '& .MuiInputBase-input': {
                            padding: '5px 10px',
                            fontSize: '12px',
                            fontWeight: (!isEditing && !isAdding) ? 'bold' : 'normal',
                            color: (!isEditing && !isAdding) ? '#000' : 'inherit',
                            WebkitTextFillColor: (!isEditing && !isAdding) ? 'black' : 'inherit',
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#d3d3d3',
                          },
                          '& .Mui-disabled': {
                            backgroundColor: '#f5f5f5',
                            color: '#000000',
                          },
                        }}
                      />
                    )}
                  />
                </Box>
              </Grid>
            );
          }

          return (
            <Grid item xs={12} sm={8} md={4} lg={3} key={key}>
            <Box width="150px" sx={{ marginTop: '1.5px' }}>
            <TextField
                  label={columns[key]}
                  name={key}
                  value={formData[key] || ''}
                  onChange={handleInputChange}
                  fullWidth
                  margin="dense"
                  disabled={!isEditing && !isAdding}
                  type={
                    key === 'designVoltage' ||
                    key === 'ahCapacity' ||
                    key === 'individualCellVoltage' ||
                    key === 'highVoltage' ||
                    key === 'lowVoltage' ||
                    key === 'highTemperature' ||
                    key === 'lowTemperature'
                      ? 'number'
                      : 'text'
                  }
                  error={!!errors[key]} // Highlight the field if there's an error
                  helperText={errors[key]} // Display the error message
                  inputProps={{
                    style: { textAlign: 'center' },
                    min: key === 'highVoltage' ? 2 : 
                        key === 'lowVoltage' ? 1.9 : 
                        key === 'batteryAboutToDie' ? 1.8 : 
                        key === 'openBattery' ? 1.4 : 
                        key === 'highTemperature' ? undefined : undefined,
                    max: key === 'highVoltage' ? 2.5 : 
                        key === 'lowVoltage' ? 2 : 
                        key === 'batteryAboutToDie' ? 1.9 : 
                        key === 'openBattery' ? 1.8 : 
                        key === 'highTemperature' ? 100 : undefined,
                  }}
                  InputLabelProps={{
                    sx: {
                      fontWeight: "bold",
                      color: "black",
                    },
                  }}
                  sx={{
                    '& .MuiInputBase-root': {
                      height: '35px',
                      fontWeight: (!isEditing && !isAdding) ? 'bold' : 'bold',
                      backgroundColor: (!isEditing && !isAdding) ? '#f0f0f0' : 'transparent',
                    },
                    '& .MuiInputBase-input': {
                      padding: '2px 10px',
                      fontSize: '12px',
                      fontWeight: (!isEditing && !isAdding) ? 'bold' : 'bold',
                      color: (!isEditing && !isAdding) ? '#000' : 'inherit',
                      WebkitTextFillColor: (!isEditing && !isAdding) ? 'black' : 'inherit',
                    },
                    '& .MuiFormLabel-root': {
                      fontSize: '12px',
                    },
                  }}
                />
            </Box>
          </Grid>
      );
    })}
    </Grid>
    </LocalizationProvider>
  );
};
const handleClear = () => {
  setSiteId(''); // Clear Substation ID
  setSerialNumber(''); // Clear Serial Number
  setFormData({}); // Clear form data
};
return (
  <div style={{ padding: '20px', fontSize: '18px' }}> {/* Set the base font size here */}
    <SearchAndAddButtons
      searchData={searchData}
      handleSearchChange={handleSearchChange}
      handleGetDetails={handleGetDetails}
      handleEdit={handleEdit}
      isEditing={isEditing}
      handleAdd={handleAdd}
      isAdding={isAdding}
      handleDeleteSite={handleDeleteSite}
      handleClear={handleClear}
    />
    <Box 
            sx={{ 
              marginTop: 1, 
              overflowY: 'auto', 
              maxHeight: 'calc(100vh - 200px)',  // Adjust this value as needed
            }}
          >
            <Typography variant="h5"  sx={{ 
          marginTop: '20px', 
          fontSize: '15px', 
          fontWeight: '800',
          background: 'linear-gradient(to bottom, #d82b27, #f09819)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
                  Site Location
                </Typography>
                {renderFormFields(columnMappingsPart1)}

                <Typography variant="h5"sx={{ 
              marginTop: '20px', 
              fontSize: '15px', 
              fontWeight: '800',
              background: 'linear-gradient(to bottom, #d82b27, #f09819)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Manufacturer Details
            </Typography>
            {renderFormFields(columnMappingsPart2)}

            <Typography variant="h5" sx={{ 
          marginTop: '20px', 
          fontSize: '15px', 
          fontWeight: '800',
          background: 'linear-gradient(to bottom, #d82b27, #f09819)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
          }}>
            Threshold Values
          </Typography>
          {renderFormFields(columnMappingsPart3)}

          {(isEditing || isAdding) && (
            <Button
              variant="contained"
              color="#d82b27"
              onClick={isAdding ? handleAddSite : handleUpdate}
              sx={{ marginTop: '20px', fontSize: '13px',background:'#d82b27' ,color:'#ffff'}}  // Adjust button font size
            >
              {isAdding ? 'Add Site' : 'Save Changes'}
            </Button>
          )}
        </Box>
        <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
        <Dialog
          open={openNoDataDialog}
          onClose={handleCloseNoDataDialog}
          aria-labelledby="no-data-dialog-title"
          aria-describedby="no-data-dialog-description"
          sx={{
            '& .MuiDialog-paper': {
              borderRadius: '12px', // Rounded corners
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)', // Subtle shadow
              width: '400px', // Fixed width
              maxWidth: '90vw', // Responsive max width
              backgroundColor: '#f5f5f5', // Light background color
            },
          }}
        >
          <DialogTitle
            id="no-data-dialog-title"
            sx={{
              backgroundColor: '#d82b27', // Red background for the title
              color: '#fff', // White text color
              fontWeight: 'bold', // Bold text
              fontSize: '1.25rem', // Larger font size
              padding: '12px 24px', // Padding
              borderBottom: '1px solid rgba(255, 255, 255, 0.2)', // Subtle border
            }}
          >
            No Data Available
          </DialogTitle>
          <DialogContent
            sx={{
              padding: '20px 24px', // Padding
            }}
          >
            <DialogContentText
              id="no-data-dialog-description"
              sx={{
                color: '#333', // Dark text color
                fontSize: '1rem', // Standard font size
                lineHeight: '1.5', // Improved readability
              }}
            >
              No data found for the selected Substation ID and Serial Number.
            </DialogContentText>
          </DialogContent>
          <DialogActions
            sx={{
              padding: '10px 24px', // Padding
              borderTop: '1px solid #e0e0e0', // Subtle border
              backgroundColor: '#fafafa', // Light background for actions
            }}
          >
            <Button
              onClick={handleCloseNoDataDialog}
              sx={{
                color: '#757575', // Gray text color
                textTransform: 'none', // Disable uppercase transformation
                fontWeight: 'bold', // Bold text
                padding: '6px 16px', // Padding
                '&:hover': {
                  backgroundColor: '#f0f0f0', // Light hover background
                },
              }}
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
  </div>
);


};

export default SiteLocation;
 