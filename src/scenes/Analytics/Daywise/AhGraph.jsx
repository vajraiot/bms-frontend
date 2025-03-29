import React, { useContext, useState } from "react";
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
import { Dialog, DialogTitle, DialogContent, Typography } from "@mui/material";
import { AppContext, formatDate } from "../../../services/AppContext";
import { fetchCycleData } from "../../../services/apiService";

export default function AHGraph({ data }) {
  const { serialNumber, siteId, startDate } = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const [selectedCycleData, setSelectedCycleData] = useState([]);
  const [cycle, setCycle] = useState([]);

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
      originalDate: item.dayWiseDate,
    };
  });

  const maxAH = Math.max(
    ...formattedData.map((d) =>
      Math.max(parseFloat(d.cumulativeAHIn), parseFloat(d.cumulativeAHOut))
    ),
    0
  );
  const yAxisMax = Math.max(maxAH * 1.2, 10);

  const handleBarClick = async (barData) => {
    setCycle([]);
    setSelectedCycleData([]);
    const clickedDate = barData.originalDate;
    const formatToTwoDecimals = (value) =>
      value !== null && value !== undefined
        ? parseFloat(value).toFixed(2)
        : "-";
    const cycle = await fetchCycleData(siteId, serialNumber, formatDate(clickedDate));
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
        cycleId: `Cycle-${item.id + 1}`,
        cumulativeAHIn: formatToTwoDecimals(item.cumulativeAHIn),
        cumulativeAHOut: formatToTwoDecimals(item.cumulativeAHOut),
        cumulativeTotalAvgTemp: formatToTwoDecimals(item.cumulativeTotalAvgTemp),
        totalSoc: formatToTwoDecimals(item.totalSoc),
      }));

    setSelectedCycleData(sameDateCycleData);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const maxCycleAH =
    selectedCycleData.length > 0
      ? Math.max(
          ...selectedCycleData.map((d) =>
            Math.max(parseFloat(d.cumulativeAHIn), parseFloat(d.cumulativeAHOut))
          )
        )
      : 0;
  const cycleYAxisMax = Math.max(maxCycleAH * 1.2, 10);

  // Custom Tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '10px 15px',
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: '0 0 5px', fontWeight: 'bold', color: '#333' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ margin: '2px 0', color: entry.color }}>
              {entry.name}: {entry.value}{entry.name === 'Temperature' ? '°C' : entry.name === 'SOC' ? '%' : 'AH'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const chartStyle = {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  return (
    <>
      <div style={chartStyle}>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart
            data={formattedData}
            margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
          >
            <XAxis 
              dataKey="date"
              tick={{ fill: '#666', fontSize: 12 }}
              tickLine={{ stroke: '#e0e0e0' }}
              axisLine={{ stroke: '#e0e0e0' }}
            />
            <YAxis
              yAxisId="left"
              domain={[0, yAxisMax]}
              tick={{ fill: '#666', fontSize: 12 }}
              tickLine={{ stroke: '#e0e0e0' }}
              axisLine={{ stroke: '#e0e0e0' }}
              label={{
                value: "Amp Hours",
                angle: -90,
                position: "insideLeft",
                offset: 10,
                fill: '#666',
                fontSize: 14,
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: '#666', fontSize: 12 }}
              tickLine={{ stroke: '#e0e0e0' }}
              axisLine={{ stroke: '#e0e0e0' }}
              label={{
                value: "Temp (°C) / SOC (%)",
                angle: 90,
                position: "insideRight",
                offset: 10,
                fill: '#666',
                fontSize: 14,
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{
                paddingTop: '20px',
                fontSize: 14,
              }}
            />
            <defs>
              <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4a90e2" stopOpacity={0.9} />
                <stop offset="100$" stopColor="#2b6cb0" stopOpacity={0.9} />
              </linearGradient>
              <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff7f50" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#e64a19" stopOpacity={0.9} />
              </linearGradient>
            </defs>
            <Bar
              yAxisId="left"
              dataKey="cumulativeAHIn"
              name="AH In"
              fill="url(#blueGradient)"
              barSize={30}
              radius={[4, 4, 0, 0]}
              onClick={handleBarClick}
              style={{ cursor: 'pointer' }}
            >
              <LabelList
                dataKey="cumulativeAHIn"
                position="top"
                offset={10}
                fill="#333"
                fontSize={12}
                fontWeight="bold"
              />
            </Bar>
            <Bar
              yAxisId="left"
              dataKey="cumulativeAHOut"
              name="AH Out"
              fill="url(#orangeGradient)"
              barSize={30}
              radius={[4, 4, 0, 0]}
              onClick={handleBarClick}
              style={{ cursor: 'pointer' }}
            >
              <LabelList
                dataKey="cumulativeAHOut"
                position="top"
                offset={10}
                fill="#333"
                fontSize={12}
                fontWeight="bold"
              />
            </Bar>
            <Line
              yAxisId="right"
              dataKey="cumulativeTotalAvgTemp"
              name="Temperature"
              stroke="#9b59b6"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line
              yAxisId="right"
              dataKey="totalSoc"
              name="SOC"
              stroke="#2ecc71"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          style: {
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        <DialogTitle style={{ 
          background: '#f8f9fa',
          borderBottom: '1px solid #e0e0e0',
          padding: '15px 24px'
        }}>
          <Typography variant="h6" style={{ color: '#333' }}>
            Cycle Data for{" "}
            {selectedCycleData.length > 0 &&
              new Date(
                cycle.find(
                  (item) =>
                    item.id === parseInt(selectedCycleData[0].cycleId.split("-")[1]) - 1
                ).dayWiseDate
              ).toDateString()}
          </Typography>
        </DialogTitle>
        <DialogContent style={{ padding: '20px' }}>
          {selectedCycleData.length === 0 ? (
            <Typography 
              variant="h6" 
              align="center" 
              style={{ 
                padding: '40px 20px',
                color: '#666',
                background: '#f8f9fa',
                borderRadius: '8px',
                margin: '20px 0'
              }}
            >
              No cycles available for this date
            </Typography>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart
                data={selectedCycleData}
                margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
              >
                <XAxis 
                  dataKey="cycleId"
                  tick={{ fill: '#666', fontSize: 12 }}
                  tickLine={{ stroke: '#e0e0e0' }}
                  axisLine={{ stroke: '#e0e0e0' }}
                />
                <YAxis
                  yAxisId="left"
                  domain={[0, cycleYAxisMax]}
                  tick={{ fill: '#666', fontSize: 12 }}
                  tickLine={{ stroke: '#e0e0e0' }}
                  axisLine={{ stroke: '#e0e0e0' }}
                  label={{
                    value: "Amp Hours",
                    angle: -90,
                    position: "insideLeft",
                    offset: 10,
                    fill: '#666',
                    fontSize: 14,
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: '#666', fontSize: 12 }}
                  tickLine={{ stroke: '#e0e0e0' }}
                  axisLine={{ stroke: '#e0e0e0' }}
                  label={{
                    value: "Temp (°C) / SOC (%)",
                    angle: 90,
                    position: "insideRight",
                    offset: 10,
                    fill: '#666',
                    fontSize: 14,
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{
                    paddingTop: '20px',
                    fontSize: 14,
                  }}
                />
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4a90e2" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#2b6cb0" stopOpacity={0.9} />
                  </linearGradient>
                  <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff7f50" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#e64a19" stopOpacity={0.9} />
                  </linearGradient>
                </defs>
                <Bar
                  yAxisId="left"
                  dataKey="cumulativeAHIn"
                  name="AH In"
                  fill="url(#blueGradient)"
                  barSize={30}
                  radius={[4, 4, 0, 0]}
                >
                  <LabelList
                    dataKey="cumulativeAHIn"
                    position="top"
                    offset={10}
                    fill="#333"
                    fontSize={12}
                    fontWeight="bold"
                  />
                </Bar>
                <Bar
                  yAxisId="left"
                  dataKey="cumulativeAHOut"
                  name="AH Out"
                  fill="url(#orangeGradient)"
                  barSize={30}
                  radius={[4, 4, 0, 0]}
                >
                  <LabelList
                    dataKey="cumulativeAHOut"
                    position="top"
                    offset={10}
                    fill="#333"
                    fontSize={12}
                    fontWeight="bold"
                  />
                </Bar>
                <Line
                  yAxisId="right"
                  dataKey="cumulativeTotalAvgTemp"
                  name="Temperature"
                  stroke="#9b59b6"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
                <Line
                  yAxisId="right"
                  dataKey="totalSoc"
                  name="SOC"
                  stroke="#2ecc71"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}