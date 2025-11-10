import { Card, CardContent, Button } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import "../../styles/organization/dashboardOrg.css";

const chartData = [
  { name: "Food Bank", hours: 240 },
  { name: "Beach Cleanup", hours: 180 },
  { name: "Tutoring", hours: 310 },
  { name: "Animal Shelter", hours: 280 },
  { name: "Community Garden", hours: 160 },
  { name: "Senior Care", hours: 220 },
];

const DashboardOrg = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-stats">
        <Card className="dashboard-stat-card">
          <CardContent>
            <h3 className="dashboard-stat-label">Total Volunteers</h3>
            <p className="dashboard-stat-value">1200</p>
          </CardContent>
        </Card>
        
        <Card className="dashboard-stat-card">
          <CardContent>
            <h3 className="dashboard-stat-label">Attendance Rate</h3>
            <p className="dashboard-stat-value">87%</p>
          </CardContent>
        </Card>
        
        <Card className="dashboard-stat-card">
          <CardContent>
            <h3 className="dashboard-stat-label">Ongoing Events</h3>
            <p className="dashboard-stat-value">30</p>
          </CardContent>
        </Card>
      </div>

      <Card className="dashboard-chart-card">
        <CardContent>
          <h2 className="dashboard-chart-title">
            Total Volunteer Hours by Opportunity
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))"
                angle={-15}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
              <Bar dataKey="hours" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="dashboard-table-card">
        <CardContent>
          <div className="dashboard-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr className="dashboard-table-header-row">
                  <th className="dashboard-table-header">Volunteer</th>
                  <th className="dashboard-table-header">Email</th>
                  <th className="dashboard-table-header">Phone</th>
                  <th className="dashboard-table-header">Status</th>
                  <th className="dashboard-table-header">Opportunity</th>
                  <th className="dashboard-table-header">Date Joined</th>
                  <th className="dashboard-table-header">Total Hours</th>
                  <th className="dashboard-table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="dashboard-table-row">
                  <td className="dashboard-table-cell">Linda Opolo</td>
                  <td className="dashboard-table-cell">opolalinda@gmail.com</td>
                  <td className="dashboard-table-cell">0712345678</td>
                  <td className="dashboard-table-cell">Active</td>
                  <td className="dashboard-table-cell">frontend developer</td>
                  <td className="dashboard-table-cell">02/10/2025</td>
                  <td className="dashboard-table-cell">12</td>
                  <td className="dashboard-table-cell">
                    <Button variant="contained" className="dashboard-view-btn">
                      View More
                    </Button>
                  </td>
                </tr>
                <tr className="dashboard-table-row">
                  <td className="dashboard-table-cell">John Doe</td>
                  <td className="dashboard-table-cell">johndoe@gmail.com</td>
                  <td className="dashboard-table-cell">0723456789</td>
                  <td className="dashboard-table-cell">Active</td>
                  <td className="dashboard-table-cell">backend developer</td>
                  <td className="dashboard-table-cell">15/09/2025</td>
                  <td className="dashboard-table-cell">28</td>
                  <td className="dashboard-table-cell">
                    <Button variant="contained" className="dashboard-view-btn">
                      View More
                    </Button>
                  </td>
                </tr>
                <tr className="dashboard-table-row">
                  <td className="dashboard-table-cell">Sarah Smith</td>
                  <td className="dashboard-table-cell">sarah.smith@gmail.com</td>
                  <td className="dashboard-table-cell">0734567890</td>
                  <td className="dashboard-table-cell">Active</td>
                  <td className="dashboard-table-cell">UI/UX designer</td>
                  <td className="dashboard-table-cell">20/08/2025</td>
                  <td className="dashboard-table-cell">35</td>
                  <td className="dashboard-table-cell">
                    <Button variant="contained" className="dashboard-view-btn">
                      View More
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOrg;