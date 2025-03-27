import React, { useContext, useState } from 'react';
import {
  Grid,
  IconButton,
  Tooltip,
  TextField,
  Autocomplete,
  Box,
  Typography,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';
import { AppContext } from '../../../services/AppContext';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const SearchAndAddButtons = ({
  handleGetDetails,
  handleEdit,
  isEditing,
  handleAdd,
  isAdding,
  handleDeleteSite,
  handleClear
}) => {
  const {
    siteOptions,
    serialNumberOptions,
    siteId,
    serialNumber,
    setSiteId,
    setSerialNumber,
    setData,
  } = useContext(AppContext);

  const [message, setMessage] = useState(''); // Generic message state
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [severity, setSeverity] = useState('error'); // 'error' or 'success'
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // const clearOptions = () => {
  //   setSiteId('');
  //   setSerialNumber('');
  // };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setMessage('');
  };

  const checkSelection = (action) => {
    if (!siteId || !serialNumber) {
      setMessage(`Please select both Substation ID and Serial Number to ${action}`);
      setSeverity('error');
      setOpenSnackbar(true);
      return false;
    }
    return true;
  };

  const handleSearchClick = () => {
    if (checkSelection('search')) {
      handleGetDetails();
    }
  };

  const handleEditClick = async () => {
    if (checkSelection('edit')) {
      try {
        await handleEdit(); // Assuming handleEdit is async and resolves on success
      } catch (error) {
        setMessage('Failed to update'); // Set error message
        setSeverity('error'); // Set severity to 'error'
        setOpenSnackbar(true); // Open the Snackbar
      }
    }
  };

  const handleDeleteClick = () => {
    if (checkSelection('delete')) {
      setOpenDeleteDialog(true);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await handleDeleteSite(); // Assuming handleDeleteSite is async and resolves on success
      setMessage('Deleted successfully'); // Set success message
      setSeverity('success'); // Set severity to 'success'
      setOpenSnackbar(true); // Open the Snackbar
    } catch (error) {
      setMessage('Failed to delete'); // Set error message
      setSeverity('error'); // Set severity to 'error'
      setOpenSnackbar(true); // Open the Snackbar
    }
    setOpenDeleteDialog(false);
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
  };

  return (
    <>
      <Grid container alignItems="center" spacing={2} justifyContent="flex-center">
        <Grid item xs={12} sm={6} md={6} display="flex" alignItems="center" gap={2}>
        <Autocomplete
            disablePortal
            freeSolo
            options={siteOptions.map((site) => site.siteId)}
            value={siteId}
            onChange={(event, newValue) => setSiteId(newValue)}
            filterOptions={(options, { inputValue }) => {
              if (!inputValue) return []; // Return empty array if no input
              const lowerInput = inputValue.toLowerCase();
              return options.filter((option) =>
                option.toLowerCase().startsWith(lowerInput)
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="SubStation ID"
                InputLabelProps={{
                  sx: { fontWeight: 'bold' },
                }}
                fullWidth
                sx={{
                  '& .MuiInputBase-root': {
                    fontWeight: 'bold',
                    height: '35px',
                    marginTop: '5px',
                  },
                }}
              />
            )}
            sx={{ width: '150px' }}
          />

          <Autocomplete
            disablePortal
            options={serialNumberOptions}
            value={serialNumber}
            onChange={(event, newValue) => setSerialNumber(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Serial Number"
                InputLabelProps={{
                  sx: { fontWeight: 'bold' },
                }}
                fullWidth
                sx={{
                  '& .MuiInputBase-root': {
                    fontWeight: 'bold',
                    height: '35px',
                    marginTop: '5px',
                  },
                }}
              />
            )}
            sx={{ width: '150px' }}
          />
          <Tooltip title="Clear">
            <Box onClick={handleClear} sx={{ cursor: 'pointer' }}>
              <Typography variant="body1" sx={{ marginTop: '8px', fontSize: 15 }}>
              ❌
              </Typography>
            </Box>
          </Tooltip>
          <Tooltip title="Search Details">
            <IconButton
              color="secondary"
              onClick={handleSearchClick}
              sx={{
                '&:hover': { backgroundColor: 'rgba(63, 81, 181, 0.1)' },
              }}
            >
              <SearchIcon sx={{ marginTop: '8px', fontSize: 20 }} />
            </IconButton>
          </Tooltip>
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          md={6}
          display="flex"
          justifyContent="flex-start"
          alignItems="center"
          gap={2}
          sx={{ pr: 4 }}
        >
          <Tooltip title={isEditing ? 'Cancel Edit' : 'Edit'}>
            <IconButton
              color="secondary"
              onClick={handleEditClick}
              sx={{
                '&:hover': { backgroundColor: 'rgba(76, 175, 80, 0.1)' },
              }}
            >
              <EditIcon sx={{ marginTop: '8px', fontSize: 20 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title={isAdding ? 'Cancel Add' : 'Add'}>
            <IconButton
              color="secondary"
              onClick={handleAdd}
              sx={{
                '&:hover': { backgroundColor: 'rgba(255, 193, 7, 0.1)' },
              }}
            >
              <AddIcon sx={{ marginTop: '8px', fontSize: 20 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete">
            <IconButton
              color="error"
              onClick={handleDeleteClick}
              sx={{
                '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' },
              }}
            >
              <DeleteIcon sx={{ marginTop: '8px', fontSize: 20 }} />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>

      {/* Styled Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCancelDelete}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            width: '400px',
            maxWidth: '90vw',
            backgroundColor: '#fff',
          },
        }}
      >
        <DialogTitle
          id="delete-dialog-title"
          sx={{
            backgroundColor: '#f44336',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '1.25rem',
            padding: '12px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          Confirm Deletion
        </DialogTitle>
        <DialogContent
          sx={{
            padding: '20px 24px',
          }}
        >
          <DialogContentText
            id="delete-dialog-description"
            sx={{
              color: '#333',
              fontSize: '1rem',
              lineHeight: '1.5',
            }}
          >
            Are you sure you want to delete the site with Substation ID{' '}
            <strong>"{siteId}"</strong> and Serial Number <strong>"{serialNumber}"</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            padding: '10px 24px',
            borderTop: '1px solid #e0e0e0',
            backgroundColor: '#fafafa',
          }}
        >
          <Button
            onClick={handleCancelDelete}
            sx={{
              color: '#757575',
              textTransform: 'none',
              fontWeight: 'bold',
              padding: '6px 16px',
              '&:hover': { backgroundColor: '#f0f0f0' },
            }}
          >
            No
          </Button>
          <Button
            onClick={handleConfirmDelete}
            sx={{
              backgroundColor: '#f44336',
              color: '#fff',
              textTransform: 'none',
              fontWeight: 'bold',
              padding: '6px 16px',
              '&:hover': { backgroundColor: '#d32f2f' },
            }}
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for Success/Error Messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={severity} // 'success' or 'error'
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SearchAndAddButtons;