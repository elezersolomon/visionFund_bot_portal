import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Stack } from "@mui/material";
import { fetchFeedbacks } from "../services/api"; // Example API call
import { useSelector } from "react-redux";
import { RootState } from "../redux";
import { Feedback } from "../models";

const FeedbackPage: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const token = useSelector((state: RootState) => state.user.token);

  // Fetch feedbacks on component mount
  useEffect(() => {
    const getFeedbacks = async () => {
      try {
        const response = await fetchFeedbacks(token);

        const sortedFeedbacks = response.sort(
          (a: Feedback, b: Feedback) =>
            new Date(b.dateCreated).getTime() -
            new Date(a.dateCreated).getTime()
        );
        setFeedbacks(sortedFeedbacks);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    };

    getFeedbacks();
  }, [token]); // Add token as a dependency to avoid warnings

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours =
      Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours <= 24) {
      // Return only the time if the date is within the last 24 hours
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      // Return the date and time if more than 24 hours
      return date.toLocaleString([], {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  return (
    <Box sx={{ paddingLeft: 5 }}>
      <Box sx={{ paddingLeft: 5 }}>
        <Typography variant="h4" gutterBottom align="center">
          Customer Feedbacks
        </Typography>
        <Box sx={{ paddingTop: 8 }}>
          <Stack spacing={4}>
            {feedbacks.map((feedback, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  position: "relative",
                }}
              >
                {/* Username */}
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: "bold",
                    marginBottom: "8px",
                    position: "relative",
                  }}
                >
                  {feedback.telegramUserName}
                </Typography>

                {/* Speech Bubble Pointer */}
                <Box
                  sx={{
                    position: "absolute",
                    top: "22px",
                    left: "10px",
                    width: 0,
                    height: 0,
                    borderLeft: "10px solid transparent",
                    borderRight: "10px solid transparent",
                    borderBottom: "10px solid #f9f9f9", // Color matches the text box
                  }}
                />

                {/* Feedback Box */}
                <Paper
                  elevation={4}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: "#f9f9f9",
                    width: "fit-content",
                    maxWidth: "100%",
                    marginLeft: "10px",
                  }}
                >
                  <Box
                    sx={{
                      padding: 0.5,
                      maxWidth: "100%",
                      flexDirection: "column",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#999",
                          fontSize: "0.70rem",
                          marginTop: 0,
                        }}
                      >
                        {formatDate(feedback.dateCreated)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        padding: 2,
                        paddingTop: 1,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ color: "#555", marginBottom: 1 }}
                      >
                        {feedback.feedback}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default FeedbackPage;
