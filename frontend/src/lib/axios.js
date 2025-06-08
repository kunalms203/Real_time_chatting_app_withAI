import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "https://finalyearproject-updated-backend2.onrender.com/api" : "https://finalyearproject-updated-backend2.onrender.com/api",
  withCredentials: true,
});
