import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Mon", hours: 2 },
  { day: "Tue", hours: 4 },
  { day: "Wed", hours: 1 },
  { day: "Thu", hours: 3 },
  { day: "Fri", hours: 5 },
  { day: "Sat", hours: 6 },
  { day: "Sun", hours: 4 },
];

function VolunteerHoursChart() {
  return (
    <div className="chart">
      <h2>Daily Hour Trends</h2>
      <ResponsiveContainer width="80%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="hours"
            stroke="#8884d8"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default VolunteerHoursChart;
