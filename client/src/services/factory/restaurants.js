import axiosClient from "..";

const restaurantsApi = {
  get: () => {
    return axiosClient.get("/restaurants");
  },
  getDetails: id => {
    return axiosClient.get(`/restaurants/${id}`);
  }
};

export default restaurantsApi;
