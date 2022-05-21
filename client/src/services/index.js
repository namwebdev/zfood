import axios from "axios";
import queryString from "query-string";

const axiosClient = axios.create({
  baseURL: "https://zynky-zfood-api.herokuapp.com/v1",
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
