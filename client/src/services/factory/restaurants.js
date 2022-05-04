import axiosClient from "..";

const restaurantsApi = {
  get: () => {
    return axiosClient.get("/restaurants");
  },
};

export default restaurantsApi;
