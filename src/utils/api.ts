import axios from "axios";

const createAxiosInstance = () => {
  // Check if running in a browser environment
  if (typeof window === "undefined") {
    return axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL_ROOT,
    });
  }
  
  const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL_ROOT,
  });
  return axiosInstance;
};

export default createAxiosInstance;
