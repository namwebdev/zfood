<template>
  <ProfileLayout>
    <div class="w-full">
      <OrderHistoryItem
        v-for="order of orders"
        :key="order.id"
        :order="order"
      />
    </div>
  </ProfileLayout>
</template>

<script setup>
import { ref } from "@vue/reactivity";
import ProfileLayout from "../layouts/ProfileLayout.vue";
import orderApi from "../services/factory/order";
import { useNotificationStore } from "../stores";
import OrderHistoryItem from "../components/Order/OrderHistoryItem.vue";

const notify = useNotificationStore();
const orders = ref([]);

init();

async function init() {
  try {
    const { data } = await orderApi.getHistory();
    if (data) orders.value = data;
  } catch (e) {
    notify.on();
  }
}
</script>

<style lang="css" scoped></style>
