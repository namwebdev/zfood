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
    <DishItem
      @onNeedLogin="visible = true"
      @onConfirmClearCart="confirmClearCart"
      v-for="dish in dishes"
      :key="dish.id"
      :dish="dish"
    />
  </div>
  <AppModal
    v-model:visible="visible"
    className="px-8 pt-4 pb-6 w-100"
    @onOk="modal.openLogin()"
  >
    <template #title>
      <div class="font-bold text-lg">Xác nhận đăng nhập</div>
    </template>
    <template #body>
      <div>
        Bạn cần đăng nhập trước khi thêm món ăn vào giỏ hàng. Đăng nhập ngay?
      </div>
    </template>
  </AppModal>
  <!--  -->
  <AppModal
    v-model:visible="visibleClearCart"
    className="px-8 pt-4 pb-6 w-100"
    @onOk="addNewDish"
    @hide="newDishToAdd = null"
  >
    <template #title>
      <div class="font-bold text-lg">Xác nhận thêm mới món ăn</div>
    </template>
    <template #body>
      <div>
        Bạn chỉ có thể đặt món ăn từ duy nhất 1 quán ăn. Nếu bạn thêm món ăn
        này, giỏ hàng cũ của bạn sẽ mất
        <div>Đồng ý thêm món ăn?</div>
      </div>
    </template>
  </AppModal>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import restaurantsApi from "../services/factory/restaurants";
import dishesApi from "../services/factory/dishes";
import AppContainer from "../components/App/AppContainer.vue";
import DishItem from "../components/Dish/DishItem.vue";
import AppModal from "../components/App/AppModal.vue";
import { useCartStore, useModalStore } from "../stores/";

const modal = useModalStore();
const visible = ref(false);
const visibleClearCart = ref(false);

const cart = useCartStore();
const newDishToAdd = ref(null);
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

function confirmClearCart(dish) {
  visibleClearCart.value = true;
  newDishToAdd.value = dish;
}
function addNewDish() {
  cart.clear();
  cart.add(newDishToAdd.value);
}
</script>
