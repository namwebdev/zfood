import { createRouter, createWebHistory } from "vue-router";
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
  ],
});

export default router;
