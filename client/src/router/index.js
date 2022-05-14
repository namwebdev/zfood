import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/";
import HomeView from "../views/Home.vue";
import RestaurantDetailsView from "../views/RestaurantDetails.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/restaurants/:id",
      name: "restaurant-details",
      component: RestaurantDetailsView,
    },
    {
      path: "/order",
      name: "order",
      component: () => import("../views/Order.vue"),
    },
    {
      path: "/profile",
      name: "profile",
      redirect: () => {
        return { path: "/profile/edit" };
      },
    },
    {
      path: "/profile/edit",
      name: "edit-profile",
      component: () => import("../views/EditProfile.vue"),
    },
    {
      path: "/profile/change-password",
      name: "change-password",
      component: () => import("../views/ChangePassword.vue"),
    },
  ],
});

export default router;
