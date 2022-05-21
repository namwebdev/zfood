import axiosClient from "../";

const orderApi = {
  order: (restaurant_id, total_price, dishes) => {
    return axiosClient.post("/order", { restaurant_id, total_price, dishes });
  },
  getHistory: () => {
    return axiosClient.get("/order/history");
  },
};

export default orderApi;
