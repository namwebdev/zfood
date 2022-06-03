import { isArray } from "@vue/shared";
import { defineStore } from "pinia";
import restaurantsApi from "../services/factory/restaurants";

export const useRestaurantsStore = defineStore({
  id: "restaurants",
  state: () => ({
    restaurants: [],
  }),
  actions: {
    async fetch() {
      try {
        const { data } = await restaurantsApi.get();
        if (isArray(data) && data.length > 0) this.restaurants = data;
      } catch (e) {
        console.error(e);
      }
    },
  },
});

export const useCartStore = defineStore({
  id: "cart",
  state: () => ({
    cart: localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [],
    restauranId: localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))[0]?.restaurant_id
      : null,
  }),
  getters: {},
  actions: {
    add(dish) {
      this.restauranId = dish.restaurant_id;

      const index = this.cart.findIndex(({ id }) => dish.id === id);
      if (index === -1) {
        const newDish = { ...dish, quantity: 1 };
        this.cart.push(newDish);
        localStorage.setItem("cart", JSON.stringify(this.cart));
        return;
      }
      this.cart[index].quantity++;
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },
    decrement(dish) {
      const index = this.cart.findIndex(({ id }) => dish.id === id);
      if (index === -1) return;
      if (this.cart[index].quantity === 1) {
        this.cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(this.cart));
        return;
      }
      this.cart[index].quantity--;
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },
    remove(dish) {
      const index = this.cart.findIndex(({ id }) => dish.id === id);
      if (index === -1) return;
      this.cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },
    clear() {
      this.cart = [];
      this.restauranId = null;
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },
  },
});

export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    user: null,
    isLogin: false,
  }),
  actions: {
    set(user) {
      this.user = user;
      this.isLogin = true;
    },
    update(user) {
      const currentInfo = this.user;
      this.user = { ...currentInfo, ...user };
    },
    logout() {
      localStorage.removeItem("token");
      this.user = null;
      this.isLogin = false;
    },
  },
});

export const useModalStore = defineStore({
  id: "modal",
  state: () => ({
    login: false,
    isLoginContent: true,
  }),
  actions: {
    openLogin() {
      this.login = true;
    },
    closeLogin() {
      this.login = false;
    },
    changeLoginContent(value = null) {
      this.isLoginContent = value || !this.isLoginContent;
    },
  },
});

export const useNotificationStore = defineStore({
  id: "notification",
  state: () => ({
    notifications: [],
  }),
  actions: {
    on(notification) {
      const { type, message, timer } = notification;
      const newNotify = {
        id: Math.floor(Math.random() * 200),
        type,
        message,
        timer,
      };
      this.notifications = [newNotify, ...this.notifications];
    },
    clear(id) {
      this.notifications = this.notifications.filter(
        (notify) => notify.id !== id
      );
    },
  },
});
