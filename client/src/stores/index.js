import { defineStore } from "pinia";

export const useCartStore = defineStore({
  id: "cart",
  state: () => ({
    cart: [],
    restauranId: null,
  }),
  getters: {},
  actions: {
    add(dish) {
      this.restauranId = dish.restaurant_id;

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
      if (this.cart[index].quantity === 1) {
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
