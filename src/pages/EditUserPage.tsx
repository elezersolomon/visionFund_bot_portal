import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  SelectChangeEvent,
  InputLabel,
  FormControl,
} from "@mui/material";
import { getBranches, resetUserPassword, updateUser } from "../services/api";
import { RootState } from "../redux";
import { useSelector } from "react-redux";
import NotificationModal from "../components/NotificationModal";

const EditUser: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.user.token);
  const user = location?.state?.user;

  interface Branch {
    id: number;
    name: string;
  }

  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await getBranches();
        setBranches(response);
        // console.log("Branches:", response);
      } catch (error) {
        // console.error("Error fetching branches:", error);
      }
    };

    fetchBranches();
  }, []);

  useEffect(() => {
    if (
      branches.length > 0 &&
      user?.branchID &&
      !formData.branch // Only set if not already set
    ) {
      setFormData((prev) => ({
        ...prev,
        branch: String(user.branchID),
      }));
    }
    // eslint-disable-next-line
  }, [branches]);

  const initialFormData = {
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phoneNumber: user?.phoneNumber || "",
    role: user?.role || "",
    branch: user?.branchid ? String(user.branchid) : "",
    email: user?.email || "",
    userName: user?.userName || "",
    userID: user?.userID || "",
    password: "",
    status: user?.status || "Active", // New status field
  };

  const [formData, setFormData] = useState(initialFormData);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | "info">(
    "info"
  );
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  // Handle changes for TextField inputs
  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (message) {
      setMessage(null);
      setMessageType("info");
    }
  };

  // Handle changes for the Select input
  const handleSelectChange = (e: SelectChangeEvent) => {
    setFormData({
      ...formData,
      [e.target.name as string]: e.target.value,
    });
  };

  // handle branch change
  const handleBranchChange = (e: SelectChangeEvent<string>) => {
    const selectedBranchID = e.target.value;
    // console.log("Branch selected:", selectedBranchID);
    setFormData({ ...formData, branch: e.target.value });
    // get branch details from api

    // Clear message when inputs are edited
    if (message) {
      setMessage(null);
      setMessageType("info");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Convert branch to number before sending
      const payload = {
        ...formData,
        branchid: formData.branch ? Number(formData.branch) : null,
      };
      const response = await updateUser(payload, token);

      // Handle success (200 status)

      setMessage(response?.message || "User updated successfully!!!");
      setMessageType("success");
      setModalOpen(true);

      // Reset the form to blank values after a successful update
      setFormData({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        role: "",
        branch: "",
        email: "",
        userName: "",
        userID: "",
        password: "",
        status: "", // Or default status value
      });

      // Handle error (400 status)
      if (response?.status === 400) {
        setMessage(
          response?.message ||
            "Unable to update user, please check the data and try again"
        );
        setMessageType("error");
        setModalOpen(true); // Show the modal with the error message
      }
    } catch (error) {
      // Handle unexpected errors
      setMessage("Failed to update user. Please try again. " + error);
      setMessageType("error");
      setModalOpen(true);
    }
  };

  // handle the reset password functionality
  async function resetPassword(e: React.MouseEvent) {
    try {
      const response = await resetUserPassword(
        {
          username: formData.userName,
          userID: formData.userID,
          firstName: formData.firstName,
          phoneNumber: formData.phoneNumber,
        },
        token
      );
      setMessage(response?.message || "User password reset successfully!!!");
      setMessageType("success");
      setModalOpen(true);
    } catch (error) {
      setMessage("Failed to reset user password. Please try again." + error);
      setMessageType("error");
      setModalOpen(true);
    }
  }
  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        mt: 8,
        width: "100%",
      }}
      onSubmit={handleSubmit}
    >
      <Typography textAlign="center" variant="h4">
        Edit User
      </Typography>
      <TextField
        label="Username"
        name="userName"
        value={formData.userName}
        onChange={handleTextFieldChange}
        disabled
        required
      />
      <TextField
        label="First Name"
        name="firstName"
        value={formData.firstName}
        onChange={handleTextFieldChange}
        required
      />
      <TextField
        label="Last Name"
        name="lastName"
        value={formData.lastName}
        onChange={handleTextFieldChange}
        required
      />
      <TextField
        label="Phone Number"
        name="phoneNumber"
        type="number"
        value={formData.phoneNumber}
        onChange={handleTextFieldChange}
        required
      />
      <TextField
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleTextFieldChange}
        required
      />
      <FormControl fullWidth>
        <InputLabel id="Role">Role</InputLabel>
        <Select
          labelId="Role"
          label="Role"
          name="role"
          value={formData.role}
          onChange={handleSelectChange}
        >
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth style={{ marginBottom: "16px" }}>
        <InputLabel>Branch *</InputLabel>
        <Select
          name="branch"
          value={formData.branch}
          onChange={handleBranchChange}
          required
        >
          <MenuItem value="">Select Branch</MenuItem>
          {branches?.length > 0 &&
            branches.map((branch) => (
              <MenuItem key={branch.id} value={String(branch.id)}>
                {branch.name}
              </MenuItem>
            ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="status-label">Status</InputLabel>
        <Select
          labelId="status-label"
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleSelectChange}
        >
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Disabled">Disabled</MenuItem>
        </Select>
      </FormControl>

      <Box sx={{ display: "flex", flexDirection: "row", gap: 2, mt: 8 }}>
        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>
        <Button onClick={resetPassword} variant="contained" color="primary">
          Reset password
        </Button>
      </Box>

      <NotificationModal
        isOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          if (messageType === "success") {
            navigate(`/admin/list-users`); // Redirect only on success
          }
        }}
        message={message!}
        messageType={messageType}
      />
    </Box>
  );
};

export default EditUser;
