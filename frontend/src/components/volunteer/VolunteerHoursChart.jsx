import React, { useEffect, useState } from "react";
import axios from "axios";
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
import moment from "moment";

function VolunteerHoursChart() {
  const [data, setData] = useState([]);
  const [view, setView] = useState("daily"); // "daily" or "weekly"
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/my-trends", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const dailyData = res.data.daily_hour_trends.map((item) => ({
          day: moment(item.date).format("MMM DD"),
          hours: item.total_hours,
          rawDate: item.date,
        }));

        if (view === "daily") {
          setData(dailyData);
        } else if (view === "weekly") {
          // Aggregate by week
          const weeks = {};
          dailyData.forEach((item) => {
            const week = moment(item.rawDate).startOf("week").format("MMM DD");
            weeks[week] = (weeks[week] || 0) + item.hours;
          });
          const weeklyData = Object.keys(weeks).map((week) => ({
            day: week,
            hours: weeks[week],
          }));
          setData(weeklyData);
        }
      } catch (err) {
        console.error("Failed to fetch trends:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, [view]);

  return (
    <div className="chart">
      <h2>Volunteer Hour Trends</h2>
      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => setView("daily")}>Daily</button>
        <button onClick={() => setView("weekly")}>Weekly</button>
      </div>

      {loading ? (
        <p>Loading trends...</p>
      ) : data.length === 0 ? (
        <div style={{ textAlign: "center", padding: "100px", color: "#888" }}>
          No trends available
        </div>
      ) : (
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
      )}
    </div>
  );
}

export default VolunteerHoursChart;
