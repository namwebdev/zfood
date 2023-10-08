import axios from "axios";
import queryString from "query-string";

const API_URL = import.meta.env.VITE_API_URL;
const baseURL = `${API_URL}/v1`

const axiosClient = axios.create({
  baseURL,
  headers: {
    "content-type": "application/json",
  },
  paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.token = token;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) return response.data;
    return response;
  },
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("cart");
    }
    throw error;
  }
);

export default axiosClient;
