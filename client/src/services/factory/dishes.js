import axiosClient from "..";

const dishesApi = {
  getByRestaurant: (id) => {
    return axiosClient.get(`/dishes`, { params: { restaurant_id: id } });
  },
};

export default dishesApi;
