import React from "react";
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

const MonthlyEnergyChart = ({ data = [] }) => {
  console.log("Chart Data:", data); // Debugging: Check the data being passed

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-96 mt-8 flex items-center justify-center bg-gray-50 border border-gray-200 rounded">
        <p className="text-gray-500">No data available for chart</p>
      </div>
    );
  }

  return (
    <div className="w-full h-96 mt-8">
      <div className="w-full h-full p-4 bg-white rounded-lg shadow-lg">
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart
            data={data}
            barSize={40}
            margin={{ bottom: 40 }} // Adjust bottom margin to fit rotated labels
            barGap={1}
            sx={{
              marginTop: 2,
            }}
            scale="linear"
          >
            {/* <CartesianGrid strokeDasharray="3 3" /> */}
            <XAxis dataKey="month" />
            <YAxis
              yAxisId="left"
              hide={true}
              tick={{ fontSize: 0, color: "black", fontWeight: 500 }}
              tickCount={10}
              label={{
                value: "Energy (kWh)",
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
                const formattedValue = parseFloat(value).toFixed(2); // Parse and fix to 2 decimal places
                if (name === "Temperature") {
                  return [`${formattedValue} °C`, "Temperature"];
                } else if (name === "SOC") {
                  return [`${formattedValue} %`, "SOC"];
                } else {
                  return [`${formattedValue} AH`, name];
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
              fill="url(#blueGradient)"
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
              fill="url(#orange)"
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
              dataKey="sumCumulativeTotalAvgTemp"
              name="Temperature"
              stroke="#8884d8"
              strokeWidth={2}
              dot={false}
            />
            <Line
              yAxisId="right"
              dataKey="sumTotalSoc"
              name="SOC"
              stroke="#82ca9d" // Green color for SOC
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyEnergyChart;