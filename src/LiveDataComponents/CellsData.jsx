import React, { useContext, useState } from "react";
import { Box, Typography, useTheme, IconButton, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import CloseIcon from "@mui/icons-material/Close"; // Import Close Icon
import Pictorial from "./CellsGraph/Pictorial";
import LineGraph from "./CellsGraph/LineGraph";
import CellTable from "./CellsGraph/CellTable";
import FullCellLayout from "./CellsGraph/Fullcelllayout"; // Import the FullCellLayout component
import { tokens } from "../theme";
import { AppContext } from "../services/AppContext";

const CellsData = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { data, serialNumber, siteId } = useContext(AppContext);
  const device = data[0];
  const { cellVoltageTemperatureData, bmsAlarmsDTO } = device;
  const [activeView, setActiveView] = useState("Pictorial");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const viewComponents = {
    Pictorial: (
      <Pictorial
        cellDataList={cellVoltageTemperatureData}
        serialNumber={serialNumber}
        siteId={siteId}
        chargingStatus={bmsAlarmsDTO?.bankDischargeCycle}
      />
    ),
    Graphical: <LineGraph data={cellVoltageTemperatureData} />,
    Tabular: <CellTable data={cellVoltageTemperatureData} />,
  };

  const toggleFullscreen = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <Box
      sx={{
        height: "100%", // Take full height of the parent (Paper)
        display: "flex",
        flexDirection: "column",
        overflow: "hidden", // Prevent scrolling in the parent
      }}
    >
      {/* Topbar */}
      <Box
        display="flex"
        justifyContent="space-around"
        alignItems="center"
        gap="8px"
        border={`1px solid black`}
        borderRadius="4px"
        padding="1px"
        sx={{
          backgroundColor: colors.primary[500],
          position: "sticky",
          top: 0,
          zIndex: 10,
          boxShadow: `0px 2px 4px ${colors.grey[500]}`,
          transition: "background-color 0.3s ease-in-out",
        }}
      >
        {["Pictorial", "Graphical", "Tabular"].map((text, index) => (
          <Box
            key={index}
            display="flex"
            justifyContent="center"
            alignItems="center"
            onClick={() => setActiveView(text)}
            sx={{
              cursor: "pointer",
              padding: "6px 12px",
              borderRadius: "4px",
              "&:hover": {
                backgroundColor: colors.primary[600],
                color: "black",
                transform: "scale(1.05)",
                transition: "all 0.3s ease-in-out",
              },
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                color: activeView === text ? colors.greenAccent[500] : "black",
                fontWeight: activeView === text ? "bold" : "normal",
              }}
            >
              {text}
            </Typography>
          </Box>
        ))}

        {/* Fullscreen Button */}
        <IconButton
          color="secondary"
          sx={{
            ml: 2,
            "&:hover": {
              backgroundColor: colors.primary[600],
              color: colors.greenAccent[500],
              transform: "scale(1.1)",
              transition: "all 0.3s ease-in-out",
            },
          }}
          onClick={toggleFullscreen}
        >
          <FullscreenIcon />
        </IconButton>
      </Box>

      {/* Active View */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto", // Enable scrolling for the active view
          mt: "10px",
        }}
      >
        {viewComponents[activeView]}
      </Box>

      {/* Fullscreen Dialog */}
      <Dialog open={isDialogOpen} onClose={closeDialog} maxWidth="lg" fullWidth>
        <IconButton
          onClick={closeDialog}
          color="secondary"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: colors.redAccent[500],
            borderRadius: "50%",
            padding: "4px",
            "&:hover": {
              backgroundColor: colors.redAccent[700],
            },
            transition: "background-color 0.3s ease",
          }}
        >
          <CloseIcon sx={{ color: "white", fontSize: "1.2rem" }} />
        </IconButton>
        <DialogContent>
          <FullCellLayout
            cellDataList={data}
            serialNumber={serialNumber}
            siteId={siteId}
            chargingStatus={bmsAlarmsDTO?.bankDischargeCycle}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CellsData;
