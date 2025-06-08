import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://finalyearproject-updated-backend2.onrender.com/api",
  withCredentials: true,
});
