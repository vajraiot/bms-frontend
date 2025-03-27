import React, { useContext, useState,useContext } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  LabelList,
} from "recharts";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { AppContext ,formatDate} from "../../../services/AppContext";
import {fetchCycleData} from "../../../services/apiService"

// Hardcoded cycle data (replace with prop or fetch in real app)


export default function AHGraph({ data }) {
  const {serialNumber,siteId,startDate}=useContext(AppContext);
  const [open, setOpen] = useState(false);
  const [selectedCycleData, setSelectedCycleData] = useState([]);
  const[cycle,setCycle]=useState([]);

  // Format data for the main graph
    const formattedData = data.map((item) => {
    const date = new Date(item.dayWiseDate);
    const month = date.toLocaleString("default", { month: "short" });
    const day = date.getDate();
    const formatToTwoDecimals = (value) =>
      value !== null && value !== undefined
        ? parseFloat(value).toFixed(2)
        : "-";
    return {
      date: `${month} ${day}`,
      cumulativeAHIn: formatToTwoDecimals(item.cumulativeAHIn),
      cumulativeAHOut: formatToTwoDecimals(item.cumulativeAHOut),
      cumulativeTotalAvgTemp: formatToTwoDecimals(item.cumulativeTotalAvgTemp),
      totalSoc: formatToTwoDecimals(item.totalSoc),
      originalDate: item.dayWiseDate, // Store original date for filtering cycle
    };
  });

  // Handle bar click
  const handleBarClick =async (barData) => {
    setCycle([])
    setSelectedCycleData([]);
    const clickedDate = barData.originalDate;
    const formatToTwoDecimals = (value) =>
      value !== null && value !== undefined
        ? parseFloat(value).toFixed(2)
        : "-";
    const cycle= await fetchCycleData(siteId,serialNumber,formatDate(clickedDate))
    // Filter cycle data for the same date (ignoring time)
    setCycle(cycle);
    const sameDateCycleData = cycle
      .filter((item) => {
        const itemDate = new Date(item.dayWiseDate);
        const clickedDateObj = new Date(clickedDate);
        return (
          itemDate.getFullYear() === clickedDateObj.getFullYear() &&
          itemDate.getMonth() === clickedDateObj.getMonth() &&
          itemDate.getDate() === clickedDateObj.getDate()
        );
      })
      .map((item) => ({
        cycleId: `Cycle-${item.id + 1}`, // Unique X-axis key
        cumulativeAHIn: formatToTwoDecimals(item.cumulativeAHIn),
        cumulativeAHOut: formatToTwoDecimals(item.cumulativeAHOut),
        cumulativeTotalAvgTemp: formatToTwoDecimals(item.cumulativeTotalAvgTemp),
        totalSoc: formatToTwoDecimals(item.totalSoc),
      }));

    setSelectedCycleData(sameDateCycleData);
    setOpen(true);
  };

  // Close dialog
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {/* Main Graph */}
      <ResponsiveContainer width="100%" height={300} padding="10px">
        <ComposedChart data={formattedData}>
          <XAxis dataKey="date" />
          <YAxis
            yAxisId="left"
            hide={true}
            label={{ value: "Amp Hours", angle: -90, position: "insideLeft", offset: -5 }}
          />
          <YAxis
            yAxisId="right"
            hide={true}
            orientation="right"
            label={{ value: "Temperature (°C) / SOC (%)", angle: -90, position: "insideRight", offset: -5 }}
          />
          <Tooltip
            formatter={(value, name) => {
              if (name === "Temperature") return [`${value} °C`, "Temperature"];
              if (name === "SOC") return [`${value} %`, "SOC"];
              return [`${value} AH`, name];
            }}
          />
          <Legend />
          <defs>
            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#003366" stopOpacity={1} />
              <stop offset="100%" stopColor="#0f52ba" stopOpacity={1} />
            </linearGradient>
            <linearGradient id="orange" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d82b27" />
              <stop offset="100%" stopColor="#f09819" />
            </linearGradient>
          </defs>
          <Bar
            yAxisId="left"
            dataKey="cumulativeAHIn"
            name="AH In"
            fill="url(#blueGradient)"
            barSize={40}
            onClick={handleBarClick}
          >
            <LabelList
              dataKey="cumulativeAHIn"
              position="top"
              fill="#000"
          
            />
          </Bar>
          <Bar
            yAxisId="left"
            dataKey="cumulativeAHOut"
            name="AH Out"
            fill="url(#orange)"
            barSize={40}
            onClick={handleBarClick}
          >
            <LabelList
              dataKey="cumulativeAHOut"
              position="top"
              fill="#000"
          
            />
          </Bar>
          <Line
            yAxisId="right"
            dataKey="cumulativeTotalAvgTemp"
            name="Temperature"
            stroke="#8884d8"
            strokeWidth={2}
            dot={false}
          />
          <Line
            yAxisId="right"
            dataKey="totalSoc"
            name="SOC"
            stroke="#82ca9d"
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Dialog with Cycle Bar Graph */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Cycle Data for{" "}
          {selectedCycleData.length > 0 &&
            new Date(
              cycle.find(
                (item) => item.id === parseInt(selectedCycleData[0].cycleId.split("-")[1]) - 1
              ).dayWiseDate
            ).toDateString()}
        </DialogTitle>
        <DialogContent>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={selectedCycleData}>
              <XAxis dataKey="cycleId" />
              <YAxis
              hide={true}
                yAxisId="left"
                label={{ value: "Amp Hours", angle: -90, position: "insideLeft", offset: -5 }}
              />
              <YAxis
              hide={true}
                yAxisId="right"
                orientation="right"
                label={{ value: "Temperature (°C) / SOC (%)", angle: 90, position: "insideRight", offset: -5 }}
              />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "Temperature") return [`${value} °C`, "Temperature"];
                  if (name === "SOC") return [`${value} %`, "SOC"];
                  return [`${value} AH`, name];
                }}
              />
              <Legend />
              <defs>
                <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#003366" stopOpacity={1} />
                  <stop offset="100%" stopColor="#0f52ba" stopOpacity={1} />
                </linearGradient>
                <linearGradient id="orange" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d82b27" />
                  <stop offset="100%" stopColor="#f09819" />
                </linearGradient>
              </defs>
              <Bar
                yAxisId="left"
                dataKey="cumulativeAHIn"
                name="AH In"
                fill="url(#blueGradient)"
                barSize={40}
              >
                <LabelList
                  dataKey="cumulativeAHIn"
                  position="top"
                  fill="#000"
                 
                />
              </Bar>
              <Bar
                yAxisId="left"
                dataKey="cumulativeAHOut"
                name="AH Out"
                fill="url(#orange)"
                barSize={40}
              >
                <LabelList
                  dataKey="cumulativeAHOut"
                  position="top"
                  fill="#000"
                  
                />
              </Bar>
              <Line
                yAxisId="right"
                dataKey="cumulativeTotalAvgTemp"
                name="Temperature"
                stroke="#8884d8"
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId="right"
                dataKey="totalSoc"
                name="SOC"
                stroke="#82ca9d"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </DialogContent>
      </Dialog>
    </>
  );
}