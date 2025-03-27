import React, { useState, useContext } from "react";
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
import { AppContext, formatDate } from "../../../services/AppContext";
import { fetchCycleData } from "../../../services/apiService";

export default function ChargingGraph({ data }) {
  const { serialNumber, siteId, startDate } = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const [selectedCycleData, setSelectedCycleData] = useState([]);
  const [cycle, setCycle] = useState([]);

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
      totalChargingEnergy: formatToTwoDecimals(item.totalChargingEnergy),
      totalDischargingEnergy: formatToTwoDecimals(item.totalDischargingEnergy),
      cumulativeTotalAvgTemp: formatToTwoDecimals(item.cumulativeTotalAvgTemp),
      totalSoc: formatToTwoDecimals(item.totalSoc),
      originalDate: item.dayWiseDate, // Store original date for filtering cycle
    };
  });

  // Handle bar click
  const handleBarClick = async (barData) => {
    setCycle([]);
    setSelectedCycleData([]);
    const clickedDate = barData.originalDate;
    const formatToTwoDecimals = (value) =>
      value !== null && value !== undefined
        ? parseFloat(value).toFixed(2)
        : "-";
    const cycleData = await fetchCycleData(siteId, serialNumber, formatDate(clickedDate));
    
    // Filter cycle data for the same date (ignoring time)
    setCycle(cycleData);
    const sameDateCycleData = cycleData
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
        totalChargingEnergy: formatToTwoDecimals(item.totalChargingEnergy),
        totalDischargingEnergy:formatToTwoDecimals(item.totalDischargingEnergy),
        cumulativeTotalAvgTemp: formatToTwoDecimals(item.cumulativeTotalAvgTemp),
        totalSoc: item.totalSoc,
      }));

    setSelectedCycleData(sameDateCycleData);
    setOpen(true);
  };

  // Close dialog
  const handleClose = () => {
    setOpen(false);
  };

  // Custom tooltip for bars
  const CustomBarTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{
          backgroundColor: '#fff',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: 0, color: '#666' }}>Click here to view cycles for this date</p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {/* Main Graph */}
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={formattedData}>
          <XAxis dataKey="date" />
          <YAxis
            yAxisId="left"
            hide={true}
            tick={{ fontSize: 0, color: "black", fontWeight: 500 }}
            tickCount={10}
            label={{
              value: "Energy (KWH)",
              angle: -90,
              position: "insideLeft",
              offset: -5,
            }}
          />
          <YAxis
            yAxisId="right"
            hide={true}
            orientation="right"
            label={{
              value: "Temperature (°C) / SOC (%)",
              angle: -90,
              position: "insideRight",
              offset: -5,
            }}
          />
          <Tooltip
            formatter={(value, name) => {
              if (name === "Temperature") {
                return [`${value} °C`, "Temperature"];
              } else if (name === "SOC") {
                return [`${value} %`, "SOC"];
              } else {
                return [`${value} KWH`, name];
              }
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
            dataKey="totalChargingEnergy"
            name="Charging Energy"
            fill="url(#blueGradient)"
            barSize={40}
            onClick={handleBarClick}
          >
            <LabelList
              dataKey="totalChargingEnergy"
              position="top"
              fill="#000"
              // formatter={(value) => value.toFixed(2)}
            />
            <Tooltip content={<CustomBarTooltip />} />
          </Bar>
          <Bar
            yAxisId="left"
            dataKey="totalDischargingEnergy"
            name="Discharging Energy"
            fill="url(#orange)"
            barSize={40}
            onClick={handleBarClick}
          >
            <LabelList
              dataKey="totalDischargingEnergy"
              position="top"
              fill="#000"
              // formatter={(value) => value.toFixed(2)}
            />
            <Tooltip content={<CustomBarTooltip />} />
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
                yAxisId="left"
                hide={true}
                label={{ value: "Energy (KWH)", angle: -90, position: "insideLeft", offset: -5 }}
              />
              <YAxis
                yAxisId="right"
                hide={true}
                orientation="right"
                label={{ value: "Temperature (°C) / SOC (%)", angle: 90, position: "insideRight", offset: -5 }}
              />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "Temperature") return [`${value} °C`, "Temperature"];
                  if (name === "SOC") return [`${value} %`, "SOC"];
                  return [`${value} KWH`, name];
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
                dataKey="totalChargingEnergy"
                name="Charging Energy"
                fill="url(#blueGradient)"
                barSize={40}
              >
                <LabelList
                  dataKey="totalChargingEnergy"
                  position="top"
                  fill="#000"
                  // formatter={(value) => value.toFixed(2)}
                />
              </Bar>
              <Bar
                yAxisId="left"
                dataKey="totalDischargingEnergy"
                name="Discharging Energy"
                fill="url(#orange)"
                barSize={40}
              >
                <LabelList
                  dataKey="totalDischargingEnergy"
                  position="top"
                  fill="#000"
                  // formatter={(value) => value.toFixed(2)}
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