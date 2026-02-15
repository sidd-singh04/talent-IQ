// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
//   withCredentials: true, // by adding this field browser will send the cookies to server automatically, on every single req
// });

// export default axiosInstance;

import axios from "axios";
import { clerk } from "@clerk/clerk-react";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosInstance.interceptors.request.use(async (config) => {
  const token = await clerk.session?.getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosInstance;
