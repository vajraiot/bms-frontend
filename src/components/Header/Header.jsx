import React, { useState,useContext } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BMS from "../../assets/images/jpeg/BMS.jpg"; // Importing the image
import { AppContext } from '../../services/AppContext';
import { useNavigate } from "react-router-dom"; 
import login from "../../assets/images/png/vajra.png";
const Header = () => {
  const { handleLogout, username } = useContext(AppContext); // Use AppContext for logout
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    handleMenuClose();
    handleLogout(navigate); 
  };

  return (
    <Box
    sx={{
      display: 'flex', // Use flexbox for alignment
      alignItems: 'center', // Vertically center all items
      justifyContent: 'space-between', // Space items appropriately
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${BMS})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      padding: '10px',
      position: 'relative',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    }}
  >
    {/* Logo Section (Left) */}
    <Box sx={{ flexShrink: 0 }}>
      <img src={login} width={120} alt="Login Logo" />
    </Box>

    {/* Title Section (Center) */}
    <Typography
      component="h1"
      className="header-title"
      sx={{
        flexGrow: 1, // Allows the title to take available space and center itself
        textAlign: 'center',
        fontSize: { xs: '20px', md: '24px' },
        fontWeight: 'bold',
        color: '#fff',
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        textShadow: '2px 2px 8px rgba(0, 0, 0, 0.5)',
      }}
    >
      Remote Battery Monitoring & Battery Charger Monitoring System
    </Typography>

    {/* User Section (Right) */}
    <Box
      sx={{
        flexShrink: 0, // Prevent shrinking
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Tooltip title="Sign Out" arrow>
        <IconButton
          onClick={handleMenuOpen}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 10px',
            borderRadius: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            },
          }}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              backgroundColor: '#1976d2',
            }}
          >
            <AccountCircleIcon />
          </Avatar>
          <Typography
            sx={{
              color: '#fff',
              fontWeight: '500',
              fontSize: '16px',
              textTransform: 'capitalize',
              textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)',
            }}
          >
            {username}
          </Typography>
        </IconButton>
      </Tooltip>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            backgroundColor: '#fff',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            borderRadius: '8px',
          },
        }}
      >
        <MenuItem
          onClick={handleSignOut}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 16px',
            color: '#d32f2f',
            '&:hover': {
              backgroundColor: 'rgba(211, 47, 47, 0.1)',
            },
          }}
        >
          <PowerSettingsNewIcon fontSize="small" />
          <Typography>Sign Out</Typography>
        </MenuItem>
      </Menu>
    </Box>
  </Box>
  );
};
export default Header;
