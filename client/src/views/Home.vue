<template>
  <AppContainer>
    <div v-if="!loading" class="list-restaurant" id="list-restaurant">
      <RestaurantItem
        v-for="restaurant in restaurants"
        :key="restaurant.id"
        :restaurant="restaurant"
      />
    </div>
    <div v-if="loading" class="list-restaurant mb-10">
      <RestaurantLoading v-for="(res, index) in 4" :key="index" />
    </div>
    <div
      v-if="restaurants.length === 0 && !loading"
      class="text-center text-primary text-xl font-bold w-full mt-5 mb-28"
    >
      Không có quán nào
    </div>
  </AppContainer>
</template>

<script setup>
import { ref, computed } from "vue";
import RestaurantItem from "@/components/Restaurant/RestaurantItem.vue";
import RestaurantLoading from "../components/Restaurant/RestaurantLoading.vue";
import AppContainer from "../components/App/AppContainer.vue";
import { useRoute } from "vue-router";
import { useRestaurantsStore } from "../stores";

const route = useRoute();
const restaurantStore = useRestaurantsStore();
const loading = ref(false);

const restaurants = computed(() => restaurantStore.restaurants);

init();

async function init() {
  if (restaurantStore.restaurants.length > 0) return;
  loading.value = true;
  await restaurantStore.fetch();
  loading.value = false;
}
</script>

<style>
.list-restaurant {
  display: grid;
  list-style: none;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  grid-gap: 2.75rem;
  @apply mt-8;
}
</style>
