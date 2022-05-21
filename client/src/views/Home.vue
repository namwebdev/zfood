<template>
  <AppContainer>
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
  </AppContainer>
</template>

<script setup>
import { ref, watch } from "vue";
import RestaurantItem from "@/components/Restaurant/RestaurantItem.vue";
import RestaurantLoading from "../components/Restaurant/RestaurantLoading.vue";
import restaurantsApi from "../services/factory/restaurants.js";
import AppContainer from "../components/App/AppContainer.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const allRestaurant = ref([]);
const restaurants = ref([]);
const loading = ref(true);

fetchRestaurants();
watch(
  () => route.query.search,
  () => {
    renderRestaurantMatchSearch();
  }
);

async function fetchRestaurants() {
  loading.value = true;
  const { data } = await restaurantsApi.get();
  if (data) allRestaurant.value = data;
  loading.value = false;
  renderRestaurantMatchSearch();
}

function renderRestaurantMatchSearch() {
  const search = route.query.search;
  if (search) {
    restaurants.value = allRestaurant.value.filter((restaurant) => {
      return convertAccentVietnamese(restaurant.name).includes(
        convertAccentVietnamese(search)
      );
    });
  } else {
    restaurants.value = allRestaurant.value;
  }
}

function convertAccentVietnamese(str) {
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");

  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
  return str;
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
