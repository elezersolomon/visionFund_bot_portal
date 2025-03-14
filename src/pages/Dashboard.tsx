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

const Dashboard: React.FC = () => {
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
    return Object.entries(obj).map(([key, value]) => ({
      status: key, // "Active" or "Disabled"
      count: value,
    }));
  };
  return (
    <Grid container spacing={2}>
      {/* Users by Role Pie Chart */}
      <Grid item xs={12} md={6}>
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
      {/* Users by Role Pie Chart */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6">Users by Role</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={preparePortalUserRoleDataByStatus(
                    dashboardData.portalUsers.countByStatus
                  )}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#82ca9d"
                  dataKey="value"
                >
                  {preparePortalUserRoleDataByStatus(
                    dashboardData.portalUsers.countByStatus
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
      {/* Users by Date Registered Bar Chart */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6">Users by Date Registered</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={prepareBarData(dashboardData.users.countByDate)}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6">User Status Trend</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={prepareLineData(dashboardData.portalUsers.countByDate)}
              >
                <XAxis dataKey="status" />
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
      ;
    </Grid>
  );
};

export default Dashboard;
