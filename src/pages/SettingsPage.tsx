import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { changePassword } from "../services/api";
import { useSelector } from "react-redux";
import { RootState, store } from "../redux/store";
import NotificationModal from "../components/NotificationModal";
import { clearUser } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | "info">(
    "info"
  );
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [logoutNeeded, setLogoutNeeded] = useState<boolean>(false);

  const user = useSelector((state: RootState) => state.user);

  const validateInputs = () => {
    let inputs = [currentPassword, newPassword, confirmNewPassword];
    let result = true;
    let message = "";

    result = inputs.every((value) => {
      if (value == "") {
        message = "please fill all the fields.";

        return false;
      } else if (value.length < 3) {
        message = "Password must be at least 3 characters long.";
        return false;
      } else if (currentPassword == newPassword) {
        // result = false;
        message = "new password is the same as old password";
        return false;
      }
      if (newPassword !== confirmNewPassword) {
        result = false;
        message = "new password and confirmed password do not match";
        return false;
      }
      return true;
    });

    if (result == false) {
      setMessage(message);
      setMessageType("error");
      setModalOpen(true);
    }
    return result;
  };

  const handleChangePassword = async () => {
    if (!validateInputs()) return;
    try {
      const response = await changePassword(
        {
          userID: user.userID,
          previousPassword: currentPassword,
          newPassword: newPassword,
        },
        user.token
      );

      setMessage(response?.message || "password has been changed successfully");
      setMessageType("success");
      setModalOpen(true);
    } catch (error: any) {
      // console.log("consoleData_ error ", error);
      setMessage(error.message);
      setMessageType("error");
      setModalOpen(true);
      if(error.message === "Trials Exceeded.") {
        setLogoutNeeded(true);
      }
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Change Password
      </Typography>
      <TextField
        label="Current Password"
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="New Password"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Confirm New Password"
        type="password"
        value={confirmNewPassword}
        onChange={(e) => setConfirmNewPassword(e.target.value)}
        fullWidth
        margin="normal"
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleChangePassword}
        sx={{ mt: 2 }}
      >
        Apply
      </Button>
      <NotificationModal
        isOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          if (messageType === "success" || logoutNeeded) {
            store.dispatch(clearUser()); // Clear user data from Redux store
            navigate(`/login`); // Redirect only on success
          }
        }}
        message={message!}
        messageType={messageType}
      />
    </Box>
  );
};

export default SettingsPage;
