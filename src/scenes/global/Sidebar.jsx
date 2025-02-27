import React, { useContext ,useState} from "react";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Box, IconButton, Typography } from "@mui/material";
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

const rolesPermissions = {
  SUPERADMIN: ['Dashboard', 'Live Data', 'Analytics', "RealTimeView","Alarm","DayWise","Monthly",'Issue Tracking', 'Site Details', 'Users'],
  ENGINEER: ['Dashboard', 'Live Data', 'Analytics',"RealTimeView","Alarm","DayWise","Monthly" ,'Issue Tracking','Users'],
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
          paddingTop: "75px",
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
          color: "#000000 !important",
        },
        "& .pro-inner-item:hover": {
          color: "#000000 !important",
          fontWeight: "bold !important",
        },
        "& .pro-menu-item.active": {
          color: "#000000 !important",
          fontWeight: "bold !important",
          borderTopLeftRadius: "30px",
          borderBottomLeftRadius: "30px",
          background: "#CBFFC0 !important",
        },
        "& .pro-menu > ul > .pro-menu-item > .pro-inner-item": {
          color: "#000000 !important",
        },
      }}
    >
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
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)} style={{ color: "#ffffff" }}>
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
              role={userRole}
            />

            <Item
              title="Live Data"
              to="/livemonitoring"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              role={userRole}
            />

            {rolesPermissions[userRole]?.includes('Analytics') && (
              <SubMenu
                title="Analytics"
                icon={<PieChartOutlineOutlinedIcon />}
              >
                <Item
                  title="RealTimeView"
                  to="/historical"
                  icon={<TimelineOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                  role={userRole}
                />
                <Item
                  title="Alarm"
                  to="/alarms"
                  icon={<AlarmOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                  role={userRole}
                />
                <Item
                  title="DayWise"
                  to="/daywise"
                  icon={<EventOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                  role={userRole}
                />
                <Item
                  title="Monthly"
                  to="/monthly"
                  icon={<CalendarTodayOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                  role={userRole}
                />
              </SubMenu>
            )}

            <Item
              title="Issue Tracking"
              to="/issuetracking"
              icon={<ReceiptOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              role={userRole}
            />

            <Item
              title="Site Details"
              to="/siteDetails"
              icon={<MapOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              role={userRole}
            />

            <Item
              title="Users"
              to="/users"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              role={userRole}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;