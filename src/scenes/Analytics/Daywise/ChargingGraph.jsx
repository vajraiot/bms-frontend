import React from 'react';
import {
  ComposedChart, // Use ComposedChart to combine Bar and Line charts
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  Line, // Add Line component for temperature and SOC
} from "recharts";

export default function ChargingGraph({ data }) {
  // Format the data to show readable dates
  const formattedData = data.map((item) => {
    const date = new Date(item.dayWiseDate);
    const month = date.toLocaleString("default", { month: "short" });
    const day = date.getDate();

    return {
      date: `${month} ${day}`,
      totalChargingEnergy: item.totalChargingEnergy,
      totalDischargingEnergy: item.totalDischargingEnergy,
      cumulativeTotalAvgTemp: item.cumulativeTotalAvgTemp, // Add temperature data
      totalSoc: item.totalSoc, // Add SOC data
    };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={formattedData}>
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <XAxis dataKey="date" />
        <YAxis
          yAxisId="left"
          hide={true}
          tick={{ fontSize: 0, color: "black", fontWeight: 500 }}
          tickCount={10}
          label={{
            value: "Energy (AH)",
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
        >
          <LabelList
            dataKey="totalChargingEnergy"
            position="top"
            fill="#000"
            formatter={(value) => value.toFixed(2)} // Format the value to 2 decimal places
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
            formatter={(value) => value.toFixed(2)} // Format the value to 2 decimal places
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
  );
}