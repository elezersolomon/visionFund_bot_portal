import axios from "axios";
import { clearUser, updateToken } from "../redux/userSlice";
import { store } from "../redux/store";

const serverBaseURL =
  process.env.REACT_APP_SERVER_BASE_URL || "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: serverBaseURL,
});

// ✅ **Attach latest token before every request**
axiosInstance.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.user.token; // Get latest token from Redux
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// ✅ **Handle response and update token**
axiosInstance.interceptors.response.use(
  (response) => {
    const newToken = response.headers.token; // Ensure the backend sends it here

    if (newToken) {
      store.dispatch(updateToken(newToken)); // Update Redux token
    }

    return response;
  },
  (error) => {
    // console.log("consoleData_ error", error);
    if (error.response?.data?.message === "token expired") {
      store.dispatch(clearUser()); // Clear user data on token expiration
      window.location.href = "/login"; // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
