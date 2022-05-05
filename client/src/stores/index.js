import { defineStore } from "pinia";

export const useCartStore = defineStore({
  id: "cart",
  state: () => ({
    cart: [],
    restauranId: null,
  }),
  getters: {},
  actions: {
    add(dish, restauranId = null) {
      if (restauranId) this.restauranId = restauranId;
      const index = this.cart.findIndex(({ id }) => dish.id === id);
      if (index === -1) {
        const newDish = { ...dish, quantity: 1 };
        this.cart.push(newDish);
        return;
      }
      this.cart[index].quantity++;
    },
    decrement(dish) {
      const index = this.cart.findIndex(({ id }) => dish.id === id);
      if (index === -1) return;
      if (this.cart[index].quantity === 0) {
        this.cart.splice(index, 1);
        return;
      }
      this.cart[index].quantity--;
    },
    remove(dish) {
      const index = this.cart.findIndex(({ id }) => dish.id === id);
      if (index === -1) return;
      this.cart.splice(index, 1);
    },
    clear() {
      this.cart = [];
      this.restauranId = null;
    },
  },
});
