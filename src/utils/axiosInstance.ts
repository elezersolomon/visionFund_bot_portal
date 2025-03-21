import axios from "axios"

function axiosInstance() {
    const serverBaseURL = process.env.REACT_SERVER_BASE_URL || "http://localhost:5000/api"
  const instance = axios.create({
    baseURL: serverBaseURL,
  })

  return instance
}
export default axiosInstance