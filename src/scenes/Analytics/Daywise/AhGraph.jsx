import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { format, parseISO } from "date-fns";

export default function AHGraph({ data }) {
  const formattedData = data.map((item) => {
    const date = new Date(item.dayWiseDate);
    const month = date.toLocaleString("default", { month: "short" });
    const day = date.getDate();

    return {
      date: `${month} ${day}`,
      cumulativeAHIn: item.cumulativeAHIn,
      cumulativeAHOut: item.cumulativeAHOut,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={formattedData}>
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <XAxis dataKey="date" />
        <YAxis
          hide={true}
          tick={{ fontSize: 0, color: "black", fontWeight: 500 }}
          tickCount={10}
          label={{
            value: "Amp Hours",
            angle: -90,
            position: "insideLeft",
            offset: -5,
          }}
        />
        <Tooltip formatter={(value) => [`${value} AH`, ""]} />
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
          dataKey="cumulativeAHIn"
          name="AH In"
          fill="url(#blueGradient)"
          barSize={40}
        >
          <LabelList
            dataKey="cumulativeAHIn"
            position="top"
            fill="#000"
            formatter={(value) => value.toFixed(2)} // Format the value to 2 decimal places
          />
        </Bar>
        <Bar
          dataKey="cumulativeAHOut"
          name="AH Out"
          fill="url(#orange)"
          barSize={40}
        >
          <LabelList
            dataKey="cumulativeAHOut"
            position="top"
            fill="#000"
            formatter={(value) => value.toFixed(2)} // Format the value to 2 decimal places
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}