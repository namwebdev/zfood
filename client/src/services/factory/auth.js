import axiosClient from "..";

const authApi = {
  login: (phone, password) => {
    return axiosClient.post("/login", { phone, password });
  },
  register: (formData) => {
    return axiosClient.post("/register", formData);
  },
  getUser: () => {
    return axiosClient.get("/user");
  },
};

export default authApi;
