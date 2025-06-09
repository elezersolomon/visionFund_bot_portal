import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import AdminPanel from "./components/AdminPanel";
import AdminDashboard from "./pages/AdminDashboard"; // Import the dashboard page
import CreateUserPage from "./pages/CreateUserPage";
import ListUsersPage from "./pages/ListUsersPage";
import EditUserPage from "./pages/EditUserPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import AddCustomerPage from "./pages/AddCustomersPage";
import CustomersPage from "./pages/CustomersPage";
import FeedbacksPage from "./pages/feedbacksPage";
import PrivateRoute from "./components/PrivateRoute";
import EditBotData from "./pages/EditBotDataPage";
import UsersDashboard from "./pages/UsersDashboard";
import ReportPage from "./pages/ReportPage";
import { useSelector } from 'react-redux';
import { RootState } from './redux';

const AppRoutes: React.FC = () => {
  // Get user's branch ID from Redux
  const userBranch = useSelector((state: RootState) => state.user.branchID);
  const isHeadOffice = userBranch === 1;

  // Define admin links based on branch
  const adminLinks = [
    { to: "/admin/admin-dashboard", text: "Dashboard" },
    { to: "/admin/create-user", text: "Create User" },
    { to: "/admin/list-users", text: "List Users" },
    { to: "/admin/customers", text: "Manage Customers" },
    { to: "/admin/feedbacks", text: "Feedbacks" },
    { to: "/admin/editbot", text: "Edit bot" },
    { to: "/admin/reports", text: "Reports" },
  ];

  // Define user links based on branch
  const userLinks = [
    { to: "/user/user-dashboard", text: "Dashboard" },
    { to: "/user/customers", text: "Manage Customers" },
    { to: "/user/feedbacks", text: "Feedbacks" },
    { to: "/user/reports", text: "Reports" },
  ];

  // Add Edit bot link for head office users
  if (isHeadOffice) {
    userLinks.splice(3, 0, { to: "/user/editbot", text: "Edit bot" });
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LoginPage />} />

        {/* Private Routes for Admin */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Layout role="admin" links={adminLinks} />
            </PrivateRoute>
          }
        >
          <Route path="admin-dashboard" element={<AdminDashboard />} />
          <Route path="create-user" element={<CreateUserPage />} />
          <Route path="list-users" element={<ListUsersPage />} />
          <Route path="edit-user/:id" element={<EditUserPage />} />
          <Route path="settings" element={<SettingsPage />} />
          {/* Redirect to dashboard by default if no other child route is matched */}
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="feedbacks" element={<FeedbacksPage />} />
          <Route path="editbot" element={<EditBotData />} />
          <Route path="reports" element={<ReportPage />} />
        </Route>

        {/* Private Routes for User */}
        <Route
          path="/user"
          element={
            <PrivateRoute>
              <Layout role="user" links={userLinks} />
            </PrivateRoute>
          }
        >
          <Route path="user-dashboard" element={<UsersDashboard />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="feedbacks" element={<FeedbacksPage />} />
          <Route path="editbot" element={<EditBotData />} />
          <Route path="reports" element={<ReportPage />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
