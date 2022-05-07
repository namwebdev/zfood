import axiosClient from "../";

const orderApi = {
  order: (restaurant_id, total_price) => {
    return axiosClient.post("/order", { restaurant_id, total_price });
  },
};

export default orderApi;
