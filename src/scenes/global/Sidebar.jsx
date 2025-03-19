import React, { useContext ,useState} from "react";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Box, IconButton, Typography,Paper } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { AppContext } from "../../services/AppContext";
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

import maha from "../../assets/images/MSEDCLlogo-removebg-preview.png"
const rolesPermissions = {
  SUPERADMIN: ['Dashboard', 'Live Data', 'Analytics', "RealTimeView","Alarm","DayWise","Monthly",'Issue Tracking', 'Site Details', 'Users'],
  ENGINEER: ['Dashboard', 'Live Data', 'Analytics',"RealTimeView","Alarm","DayWise","Monthly" ,'Issue Tracking'],
  SITE_ENGINEER: ['Dashboard', 'Live Data', 'Analytics',"RealTimeView","Alarm","DayWise","Monthly", 'Issue Tracking', 'Site Details'],
  USER: ['Dashboard', 'Live Data', 'Analytics',"RealTimeView","Alarm","DayWise","Monthly", 'Issue Tracking']
};

const Item = ({ title, to, icon, selected, setSelected, role }) => {
  const allowedItems = rolesPermissions[role] || [];

  if (!allowedItems.includes(title)) {
    return null; // Don't render the item if the role doesn't have access
  }

  const handleItemClick = () => {
    setSelected(title);
  };

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: selected === title ? "#fff" : "#000000",
        backgroundColor: selected === title ? "#e3e3e3" : "transparent",
      }}
      onClick={handleItemClick}
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
  const { userRole } = useContext(AppContext);

  return (
    <Box
      sx={{
        "& .pro-sidebar": {
          width: isCollapsed ? "60px" : "180px", // Reduced overall width
          minWidth: isCollapsed ? "60px" : "20px",
          transition: "all 0.3s ease",

          height:"85vh",
          flexGrow:1

        },
        "& .pro-sidebar-inner": {
          background:
            "linear-gradient(180deg, rgba(204, 85, 0, 0.9) 0%, rgba(253, 150, 0, 0.7) 50%, rgba(102, 223, 69, 0.4) 100%)",
          backdropFilter: "blur(8px)",
          height: "100%",
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
          color: "#ffffff",
          marginRight: "5px !important", // Reduced gap between icon and text
          minWidth: "24px", // Smaller icon wrapper
        },
        "& .pro-inner-item": {
          padding: "6px 10px !important", // Reduced padding around items
          color: "#ffffff !important",
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 500,
          fontSize: "14px", // Reduced font size
          letterSpacing: "0.3px", // Slightly tighter letter spacing
        },
        "& .pro-inner-item:hover": {
          color: "#fff3e0 !important",
          background: "rgba(255, 243, 224, 0.1) !important",
          transform: "translateX(3px)", // Reduced hover shift
          transition: "all 0.2s ease",
        },
        "& .pro-menu-item.active": {
          color: "#fff3e0 !important",
          background: "rgba(255, 243, 224, 0.2) !important",
          borderLeft: "3px solid #fff3e0", // Thinner active border
          fontWeight: "700 !important",
          borderRadius: "0 15px 15px 0", // Smaller radius
        },
        "& .pro-menu > ul > .pro-menu-item > .pro-inner-item": {
          color: "#ffffff !important",
          width: "100%", // Adjusted to fit new width
        },
        "& .pro-sub-menu .pro-inner-item": {
          fontSize: "13px", // Reduced font size for submenu items
          padding: "5px 15px !important", // Reduced padding for submenu
        },
        "& .pro-sub-menu": {
          padding: "0 !important", // Remove extra padding around submenu
        },
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: isCollapsed ? "60px" : "180px", // Match reduced ProSidebar width
          transition: "width 0.3s ease",
          overflow: "hidden",
          // borderRadius: "0 10px 10px 0",
        }}
      >
        <ProSidebar collapsed={isCollapsed}>
          <Menu iconShape="square">
            {/* LOGO AND MENU ICON */}
            <Box
              display="flex"
              alignItems="center"
              justifyContent={isCollapsed ? "center" : "space-between"}
              sx={{ padding: "8px 10px" }}
            >
              {!isCollapsed && (
                <img
                  src={maha}
                  alt="Maha Logo"
                  style={{ width: "100px" }} // Adjusted logo size
                />
              )}
              <IconButton
                onClick={() => setIsCollapsed(!isCollapsed)}
                sx={{ padding: 0,alignSelf:"flex-start" }}
              >
                <MenuOutlinedIcon sx={{ color: "#ffffff", fontSize: "20px" }} />
              </IconButton>
            </Box>
            <Box sx={{ paddingLeft: isCollapsed ? "0" : "0px", mt: "10px" /* Reduced margin */ }}>
              <Item
                title="Dashboard"
                to="/"
                icon={<HomeOutlinedIcon sx={{ fontSize: "20px" }} />}
                selected={selected}
                setSelected={setSelected}
                role={userRole}
              />
              <Item
                title="Live Data"
                to="/livemonitoring"
                icon={<PeopleOutlinedIcon sx={{ fontSize: "20px" }} />}
                selected={selected}
                setSelected={setSelected}
                role={userRole}
              />

              {rolesPermissions[userRole]?.includes("Analytics") && (
                <SubMenu
                  title="Analytics"
                  icon={<PieChartOutlineOutlinedIcon sx={{ fontSize: "20px" }} />}
                  sx={{
                    "& .pro-inner-item": {
                      fontWeight: 600,
                      fontSize: "15px", // Reduced font size for submenu title
                      paddingLeft: isCollapsed ? "15px" : "30px", // Reduced padding
                    },
                    "& .pro-icon-wrapper": {
                      marginRight: isCollapsed ? "0" : "5px", // Reduced gap
                    },
                    "& .pro-sub-menu": {
                      position: "relative",
                      left: 0,
                      width: "100%",
                    },
                  }}
                >
                  <Item
                    title="RealTimeView"
                    to="/historical"
                    icon={<TimelineOutlinedIcon sx={{ fontSize: "18px" }} />}
                    selected={selected}
                    setSelected={setSelected}
                    role={userRole}
                  />
                  <Item
                    title="Alarm"
                    to="/alarms"
                    icon={<AlarmOutlinedIcon sx={{ fontSize: "18px" }} />}
                    selected={selected}
                    setSelected={setSelected}
                    role={userRole}
                  />
                  <Item
                    title="DayWise"
                    to="/daywise"
                    icon={<EventOutlinedIcon sx={{ fontSize: "18px" }} />}
                    selected={selected}
                    setSelected={setSelected}
                    role={userRole}
                  />
                  <Item
                    title="Monthly"
                    to="/monthly"
                    icon={<CalendarTodayOutlinedIcon sx={{ fontSize: "18px" }} />}
                    selected={selected}
                    setSelected={setSelected}
                    role={userRole}
                  />
                </SubMenu>
              )}

              <Item
                title="Issue Tracking"
                to="/issuetracking"
                icon={<ReceiptOutlinedIcon sx={{ fontSize: "20px" }} />}
                selected={selected}
                setSelected={setSelected}
                role={userRole}
              />
              <Item
                title="Site Details"
                to="/siteDetails"
                icon={<MapOutlinedIcon sx={{ fontSize: "20px" }} />}
                selected={selected}
                setSelected={setSelected}
                role={userRole}
              />
              <Item
                title="Users"
                to="/users"
                icon={<PeopleOutlinedIcon sx={{ fontSize: "20px" }} />}
                selected={selected}
                setSelected={setSelected}
                role={userRole}
              />
            </Box>
          </Menu>
        </ProSidebar>
      </Paper>
    </Box>
  );
};
export default Sidebar;
