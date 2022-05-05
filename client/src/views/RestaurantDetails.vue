<template>
  <div class="bg-white py-14 mt-16">
    <AppContainer :hasMargin="false" class="flex">
      <div class="w-100">
        <img class="w-full rounded-xs" :src="restaurant.image" alt="" />
      </div>
      <!--  -->
      <div class="ml-16 my-auto">
        <div class="border-b border-light-gray pb-5 mb-2">
          <div class="text-xl font-bold">{{ restaurant.name }}</div>
          <div>{{ restaurant.address }}</div>
        </div>
        <div class="text-xxs text-gray">{{ restaurant.category }}</div>
      </div>
    </AppContainer>
  </div>
  <!--  -->
  <div class="w-110 mt-16 mx-auto bg-white px-10 py-8 rounded-xs">
    <DishItem v-for="dish in dishes" :key="dish.id" :dish="dish" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import restaurantsApi from "../services/factory/restaurants";
import dishesApi from "../services/factory/dishes";
import AppContainer from "../components/App/AppContainer.vue";
import DishItem from "../components/Dish/DishItem.vue";

const loading = ref(false);
const restaurant = ref({});
const dishes = ref([]);
const route = useRoute();
const id = route.params.id;

fetchDetails();
fetchDishes();

async function fetchDetails() {
  loading.value = true;
  const { data } = await restaurantsApi.getDetails(id);
  restaurant.value = data;
  loading.value = false;
}

async function fetchDishes() {
  const { data } = await dishesApi.getByRestaurant(id);
  dishes.value = data;
}
</script>
