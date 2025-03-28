import React from "react";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  Line,
} from "recharts";

const MonthlyAHChart = ({ data = [] }) => {
  console.log("Chart Data:", data);

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-96 mt-8 flex items-center justify-center bg-gray-50 border border-gray-200 rounded">
        <p className="text-gray-500">No data available for chart</p>
      </div>
    );
  }

  // Calculate max value for YAxis domain
  const maxAH = Math.max(
    ...data.map((d) =>
      Math.max(parseFloat(d.cumulativeAHIn), parseFloat(d.cumulativeAHOut))
    )
  );
  const yAxisMax = Math.max(maxAH * 1.3, 10);

  // Custom Tooltip
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
              {entry.name}: {parseFloat(entry.value).toFixed(2)}{entry.name === 'Temperature' ? '°C' : entry.name === 'SOC' ? '%' : ' AH'}
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
    <div className="w-full h-96 mt-8">
      <div style={chartStyle}>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 10, bottom: 10, left: 10 }}
          >
            <XAxis 
              dataKey="month"
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
                value: "Amp Hours (AH)",
                angle: -90,
                position: "outsideLeft",
                offset: -30,
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
                position: "outsideRight",
                offset: -30,
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
                formatter={(value) => parseFloat(value).toFixed(2)}
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
                formatter={(value) => parseFloat(value).toFixed(2)}
              />
            </Bar>
            <Line
              yAxisId="right"
              dataKey="sumCumulativeTotalAvgTemp"
              name="Temperature"
              stroke="#9b59b6"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line
              yAxisId="right"
              dataKey="sumTotalSoc"
              name="SOC"
              stroke="#2ecc71"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyAHChart;