import React, { useState, useEffect } from "react";
import {
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
  LineChart,
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

const statusColors: Record<string, string> = {
  InProgress: "#FFBB28", // Green
  Contacted: "#00C49F", // Red
  New: "#F44336",
};

const UsersDashboard: React.FC = () => {
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

  /**
   * Converts an object into an array suitable for Recharts PieChart.
   * @param obj - The input object with key-value pairs.
   * @returns Array formatted for PieChart.
   */
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

  /**
   * Converts an object into an array suitable for Recharts BarChart.
   * @param obj - The input object with key-value pairs.
   * @returns Array formatted for BarChart.
   */
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

  return (
    <Grid container spacing={2}>
      {Object.entries(dashboardData.users.countByStatus).map(
        ([status, count]) => (
          <Grid spacing={2} item xs={12} sm={6} md={4} key={status}>
            <Card
              sx={{
                borderLeft: `6px solid ${statusColors[status] || "#2196F3"}`,
                height: 150, // Increased card height
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h6">{status} Users</Typography>
                <Typography variant="h4" fontWeight="bold">
                  {typeof count == "number" ? count : 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )
      )}

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6">User Creation Graph</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={prepareLineData(dashboardData.users.countByDate)}
              >
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6">First Time Bot Visits</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={prepareLineData(dashboardData.leads.countByDate)}
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

export default UsersDashboard;
