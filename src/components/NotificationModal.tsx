import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

interface NotificationModalProps {
  message: string;
  messageType: "success" | "error" | "info";
  onClose: () => void;
  isOpen: boolean;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ message, messageType, onClose, isOpen }) => {
  // Determine text color based on message type
  const getTextColor = () => {
    switch (messageType) {
      case "success":
        return "green";
      case "error":
        return "red";
      case "info":
        return "black";
      default:
        return "black";
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: 'absolute' as 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid',
          borderColor: 'text.primary',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        <Typography id="modal-title" variant="h6" component="h2" sx={{ color: getTextColor(), mb: 2 }}>
          {message}
        </Typography>
        <Button variant="contained" onClick={onClose} sx={{ mt: 2 }}>
          OK
        </Button>
      </Box>
    </Modal>
  );
};

export default NotificationModal;
