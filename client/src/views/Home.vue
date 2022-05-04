<script setup>
import { ref } from "vue";
import RestaurantItem from "@/components/Restaurant/RestaurantItem.vue";
import RestaurantLoading from "../components/Restaurant/RestaurantLoading.vue";
import restaurantsApi from "../services/factory/restaurants.js";

const restaurants = ref([]);
const loading = ref(true);

fetchRestaurants();

async function fetchRestaurants() {
  loading.value = true;
  const { data } = await restaurantsApi.get();
  if (data) restaurants.value = data;
  loading.value = false;
}
</script>

<template>
  <div class="container">
    <div v-if="!loading" class="list-restaurant" id="list-restaurant">
      <RestaurantItem
        v-for="restaurant in restaurants"
        :key="restaurant.id"
        :restaurant="restaurant"
      />
    </div>
    <div v-if="loading" class="list-shot">
      <RestaurantLoading v-for="(res, index) in 4" :key="index" />
    </div>
  </div>
</template>

<style>
.list-restaurant {
  display: grid;
  list-style: none;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  grid-gap: 2.75rem;
  @apply mt-8;
}
</style>
