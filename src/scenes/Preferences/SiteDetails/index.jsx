import React, { useState, useEffect, useContext } from 'react';
import {fetchStatesDetails, fetchCirclesDetails, fetchAreasDetails, fetchSiteDetailsBatteryandChargerdetails, updateSiteLocation, addSiteLocation, deleteSite } from '../../../services/apiService';
import { Grid, Typography, TextField, Button,Box ,Autocomplete, FormControl, MenuItem } from '@mui/material';
import SearchAndAddButtons from '../SearchAndAddButtons/index';
import { AppContext } from "../../../services/AppContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
const BASE_URL = "http://122.175.45.16:51270";
import axios from "axios";
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
  individualCellVoltage: 'Individual Cell Voltage',
  highVoltage: 'High Voltage',
  lowVoltage: 'Low Voltage',
  batteryAboutToDie: 'Battery About To Die',
  openBattery: 'Open Battery',
  highTemperature: 'High Temperature',
  lowTemperature: 'Low Temperature',
  notCommnVoltage: 'Not Communicating Voltage',
  notCommnTemperature: 'Not Communicating Temperature',
};

const SiteLocation = () => {
  const [siteDetails, setSiteDetails] = useState([]);
  const [formData, setFormData] = useState({});
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statesData = await fetchStatesDetails();
        const circlesData = await fetchCirclesDetails();
        const areasData = await fetchAreasDetails();

        console.log("States Data:", statesData); // Debugging: Log the API response
        console.log("Circles Data:", circlesData); // Debugging: Log the API response
        console.log("Areas Data:", areasData); // Debugging: Log the API response

        setStateOptions(statesData);
        setCircleOptions(circlesData);
        setAreaOptions(areasData);
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
    setState(newValue); // Set the selected state
    setCircle(""); // Clear previous circle selection
    setArea(""); // Clear previous area selection

    
  };

  const handleCircleChange = (event, newValue) => {
    setCircle(newValue); // Set the selected circle
    setArea(""); // Clear previous area selection

    
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
      console.log('Fetching details for siteId:', siteId, 'and serialNumber:', serialNumber);
  
      const response = await fetchSiteDetailsBatteryandChargerdetails(siteId, serialNumber);
  
      if (response && response.data) {
        const siteData = response.data;
        console.log('Fetched site data:', siteData);
  
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
          firstUsedDate:siteData.manufacturerDTO?.firstUsedDate||'',
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
  
        console.log('Combined form data:', combinedData);
        setFormData(combinedData);
      } else {
        console.log('No data found for the given siteId and serialNumber.');
      }
    } catch (error) {
      console.error('Error fetching site details:', error);
    }
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
 
  const handleUpdate = async () => {
    try {
      console.log('Form Data before API call:', formData);

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
        }
      };
  
      console.log('Payload being sent to addSiteLocation API:', combinedData);
        //const updatedData = { ...formData }; // Use formData as-is
    
        const response = await axios.put(`${BASE_URL}/api/updateSiteLocationToSiteId`, combinedData);
         // Pass siteId and payload
        alert('Site details updated successfully!');
        setIsEditing(false);
    } catch (error) {
        console.error('Error updating site details:', error);

        // Log error response if available
        if (error.response) {
            console.error('Error response:', error.response.data);
            alert(`Failed to update site details: ${error.response.data.message}`);
        } else if (error.message) {
            alert(`Failed to update site details: ${error.message}`);
        } else {
            alert('Failed to update site details. An unexpected error occurred.');
        }
    }
};



const handleAddSite = async () => {
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
  </div>
);


};

export default SiteLocation;
 