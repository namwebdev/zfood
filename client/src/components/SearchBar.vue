<template>
  <div
    id="search-bar"
    class="input relative border border-light-gray py-2 px-3 w-full rounded-sm shadow-sm font-thin duration-100 shadow-gray-100 hover:shadow-lg flex justify-center items-center"
    :class="{
      'outline outline-0 shadow-lg border-primary-700': isFocus,
    }"
  >
    <div>
      <SearchIcon />
    </div>
    <input
      type="text"
      placeholder="Nhập tên quán ăn để tìm kiếm"
      class="w-full bg-transparent pl-2"
      @focus="isFocus = true"
      v-model="search"
      @input="handleSearch"
      @keyup.enter="handleSearch"
    />
    <div v-show="search">
      <CloseIcon class="cursor-pointer" size="15" @click.stop="clear" />
    </div>
    <div v-show="show" class="search-result">
      <perfect-scrollbar>
        <div
          v-for="restaurant in restaurants"
          :key="restaurant.id"
          class="flex items-center py-1 px-3 cursor-pointer hover:bg-light-gray"
          @click.stop="handleClick(restaurant.id)"
        >
          <img class="w-20 mr-4" :src="restaurant.image" alt="" />
          <div class="w-56">
            <div class="restaurant-name">{{ restaurant.name }}</div>
            <div class="restaurant-address text-xs">
              {{ restaurant.address }}
            </div>
          </div>
        </div>
        <div
          v-show="search && restaurants.length === 0"
          class="text-center mt-2 my-4"
        >
          Không có quán ăn nào phù hợp
        </div>
      </perfect-scrollbar>
    </div>
  </div>
</template>

<script setup>
import Input from "./Input/Input.vue";
import SearchIcon from "./Icons/SearchIcon.vue";
import CloseIcon from "./Icons/CloseIcon.vue";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useRestaurantsStore } from "../stores";

const route = useRoute();
const router = useRouter();
const restaurantStore = useRestaurantsStore();

const search = ref("");
const show = ref(false);
const isFocus = ref(false);
const loading = ref(false);
const restaurants = ref([]);

watch(
  () => isFocus.value,
  (value) => {
    show.value = value;
  }
);

init();

document.addEventListener("click", (e) => {
  const parent = document.getElementById("search-bar");
  if (e.target === parent || parent.contains(e.target)) return;
  isFocus.value = false;
});

async function init() {
  setTimeout(async () => {
    if (restaurantStore.restaurants.length > 0 || route.path === "/") return;
    loading.value = true;
    await restaurantStore.fetch();
    loading.value = false;
  });
}
function handleSearch() {
  if (search.value === "") {
    restaurants.value = [];
    return;
  }
  restaurants.value = restaurantStore.restaurants.filter((restaurant) => {
    return convertAccentVietnamese(restaurant.name).includes(
      convertAccentVietnamese(search.value)
    );
  });
  return;
}
function handleClick(id) {
  setTimeout(() => {
    isFocus.value = false;
    router.push({ path: `/restaurants/${id}` });
  });
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
function clear() {
  search.value = "";
  restaurants.value = [];
}
</script>

<style lang="css" scoped>
.search-result {
  @apply absolute w-full bg-white left-0 rounded-xs;
  top: 42px;
}
.ps {
  max-height: 200px;
}

.restaurant-name,
.restaurant-address {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.input {
  border-radius: 50px;
  height: 42px;
  width: 400px;
}
svg {
  @apply text-primary;
}
input:focus-visible {
  outline: none;
}
</style>
