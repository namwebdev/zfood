<template>
  <ProfileLayout>
    <div class="w-full">
      <OrderHistoryItem
        v-for="order of orders"
        :key="order.id"
        :order="order"
      />
      <div v-if="loading">
        <div v-for="el in 2" :key="el" class="bg-white px-6 py-4 ml-8 mb-5">
          <DishLoading v-for="i in 2" :key="i" />
        </div>
      </div>
    </div>
  </ProfileLayout>
</template>

<script setup>
import { ref } from "@vue/reactivity";
import ProfileLayout from "../layouts/ProfileLayout.vue";
import orderApi from "../services/factory/order";
import { useNotificationStore } from "../stores";
import OrderHistoryItem from "../components/Order/OrderHistoryItem.vue";
import DishLoading from "../components/Dish/DishLoading.vue";

const notify = useNotificationStore();

const orders = ref([]);
const loading = ref(false);

init();

async function init() {
  try {
    loading.value = true;
    const { data } = await orderApi.getHistory();
    if (data) orders.value = data;
  } catch (e) {
    notify.on();
  } finally {
    loading.value = false;
  }
}
</script>

<style lang="css" scoped></style>
