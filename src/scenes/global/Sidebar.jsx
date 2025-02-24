import React, { useState } from "react";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Box, IconButton, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import logo from '../../assets/images/png/vajra.png';
import profilePic from '../../assets/images/png/maha.png';
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import AlarmOutlinedIcon from "@mui/icons-material/AlarmOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const handleItemClick = () => {
    setSelected(title);
  };

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: selected === title ? "#fff" : "#000000", // Text color white when selected
        backgroundColor: selected === title ? "#e3e3e3" : "transparent", // Background color for selected item
      }}
      onClick={handleItemClick} // Trigger the click handler
      icon={icon}
    >
        <Typography sx={{ fontWeight: "bold" }}>{title}</Typography>
      <Link to={to} style={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0, zIndex: 1 }} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  return (
    <Box
  sx={{
    "& .pro-sidebar": {
      paddingTop:"75px",
      width: isCollapsed ? "80px" : "210px",
      minWidth: isCollapsed ? "80px" : "210px",
      transition: "width 0.3s ease",
    },
    "& .pro-sidebar-inner": {
      background: "#000000 !important",
      background: "linear-gradient(to bottom, #f09819, #ffd347) !important",
      transition: "all 0.3s ease",
    },
    "& .pro-icon-wrapper": {
      backgroundColor: "transparent !important",
    },
    "& .pro-inner-item": {
      padding: "5px 35px 5px 20px !important",
      color: "#000000 !important", // Default text color
    },
    "& .pro-inner-item:hover": {
      color: "#000000 !important", // Hover color to black
      fontWeight: "bold !important",
    },
    "& .pro-menu-item.active": {
      color: "#000000 !important", // Active item text color to black
      fontWeight: "bold !important",
      borderTopLeftRadius:"30px",
      borderBottomLeftRadius:"30px",
      background: "#CBFFC0 !important", // Optional: Highlight active item with a background
    },
    "& .pro-menu > ul > .pro-menu-item > .pro-inner-item": {
      color: "#000000 !important",
    },
  }}
>
{/* <img src={logo} alt="Logo" style={{ height: "35px",objectFit: "contain",margin:"40px 0px 0px 40px", }} /> */}
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
          
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                

                <IconButton onClick={() => setIsCollapsed(!isCollapsed)} style={{color :"#ffffff"}}> 
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>


          

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
          <Box mb="20px" /> 
            <Item
              title="Dashboard"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Live Data"
              to="/livemonitoring"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <SubMenu
              title="Analytics"
              icon={<PieChartOutlineOutlinedIcon />}
              // style={{ color: "#000000" }}
            >
              <Item
                title="RealTimeView"
                to="/historical"
                icon={<TimelineOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Alarm"
                to="/alarms"
                icon={<AlarmOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="DayWise"
                to="/daywise"
                icon={<EventOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Monthly"
                to="/monthly"
                icon={<CalendarTodayOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            </SubMenu>

            <Item
              title="Issue Tracking"
              to="/issuetracking"
              icon={<ReceiptOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Site Details"
              to="/siteDetails"
              icon={<MapOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Users"
              to="/users"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
     

      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
