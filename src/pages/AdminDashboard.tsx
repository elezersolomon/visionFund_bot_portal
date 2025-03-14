import React, { useState, useEffect } from "react";
import {
  LineChart,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
} from "recharts";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import { getDashboardData } from "../services/api";
import { useSelector } from "react-redux";
import { RootState } from "../redux";
import { DashboardData } from "../models";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28DFF",
  "#FF6384",
];

const AdminDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const token = useSelector((state: RootState) => state.user.token);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getDashboardData(token);
        console.log("consoleData_ dashboard data", data);
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setDashboardData(null);
      }
    };
    fetchDashboardData();
  }, [token]);

  if (!dashboardData) return <Typography>Loading...</Typography>;
  const preparePortalUserDataByRole = (
    obj: Record<string, number> | undefined
  ) => {
    return obj
      ? Object.entries(obj).map(([key, value]) => ({ name: key, value }))
      : [];
  };

  const preparePortalUserRoleDataByStatus = (obj: Record<string, number>) => {
    return Object.entries(obj).map(([key, value]) => ({
      name: key, // "Active" or "Disabled"
      value: value,
    }));
  };

  const prepareBarData = (obj: Record<string, number>) => {
    return obj
      ? Object.entries(obj)
          .filter(([key]) => key !== "Invalid Date") // Remove invalid dates
          .map(([key, value]) => ({ date: key, count: value }))
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          ) // Sort by date
      : [];
  };
  const prepareLineData = (obj: Record<string, number>) => {
    return Object.entries(obj)
      .map(([key, value]) => ({
        date: key, // "Active" or "Disabled"
        count: value,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort by date;
  };

  const UserStatStatusColors: Record<string, string> = {
    Active: "#4CAF50", // Green
    Disabled: "#F44336", // Red
  };

  const CustomerStatStatusColors: Record<string, string> = {
    InProgress: "#FFBB28", // Green
    Contacted: "#00C49F", // Red
    New: "#F44336",
  };

  return (
    <Grid container spacing={2}>
      <Grid
        sx={{
          boxShadow: "none",
          paddingTop: "10px",
          display: "flex", // Makes the Grid item itself flexible
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
        spacing={5}
        color="red"
        container
      >
        {Object.entries(dashboardData.portalUsers.countByStatus).map(
          ([status, count]) => (
            <Grid item xs={12} sm={6} md={4} key={status}>
              <Card
                sx={{
                  borderLeft: `6px solid ${
                    UserStatStatusColors[status] || "#2196F3"
                  }`,
                  height: 150, // Increased card height
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h6">{status} Users</Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {count}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )
        )}
      </Grid>

      <Grid
        spacing={2}
        sx={{
          boxShadow: "none",
          paddingTop: "10px",
          display: "flex", // Makes the Grid item itself flexible
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
        container
      >
        {Object.entries(dashboardData.users.countByStatus).map(
          ([status, count]) => (
            <Grid item xs={12} sm={6} md={4} key={status}>
              <Card
                sx={{
                  borderLeft: `6px solid ${
                    CustomerStatStatusColors[status] || "#2196F3"
                  }`,
                  height: 150, // Increased card height
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h6">{status} Customers</Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {count}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )
        )}
      </Grid>

      {/* Users by Role Pie Chart */}

      <Grid spacing={2} item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6">Users by Role</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={preparePortalUserDataByRole(
                    dashboardData.portalUsers.countByCategory
                  )}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#82ca9d"
                  dataKey="value"
                >
                  {preparePortalUserDataByRole(
                    dashboardData.portalUsers.countByCategory
                  ).map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6">User Creation Graph</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={prepareLineData(dashboardData.portalUsers.countByDate)}
              >
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#0088FE"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default AdminDashboard;
