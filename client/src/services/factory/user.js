import axiosClient from "..";

const userApi = {
  updateInfo: (form) => {
    return axiosClient.put("/user/update-info", form);
  },
  changePassword: (form) => {
    return axiosClient.put("/user/change-password", form);
  }
};

export default userApi;
