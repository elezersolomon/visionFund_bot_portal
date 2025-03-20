import axios from "axios"

function axiosInstance() {
  const serverBaseURL = process.env.REACT_APP_SERVER_BASE_URL
  
  if (!serverBaseURL) {
    console.error("Base URL is not defined");
    throw new Error("Base URL is not defined");
  }

  const instance = axios.create({
    baseURL: serverBaseURL,
  })

  return instance
}
export default axiosInstance