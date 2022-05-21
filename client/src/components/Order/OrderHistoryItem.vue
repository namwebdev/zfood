<template>
  <div class="bg-white ml-8 rounded-xs px-10 py-6 w-full mb-4">
    <div class="flex items-center border-b border-light-gray pb-2 mb-4 w-full">
      <router-link
        :to="`/restaurants/${order.restaurant_id}`"
        class="font-bold text-lg hover:text-primary"
        >{{ order.restaurant.name }}</router-link
      >
      <div
        class="border-r border-l border-light-gray px-4 mx-4 text-xs text-gray"
      >
        {{ order.restaurant.category }}
      </div>
      <div class="text-sm"><span class="">Ngày đặt:</span> {{ date }}</div>
    </div>
    <div
      v-for="dish of order.dish_orders"
      :key="dish.dish_id"
      class="flex border-light-gray mb-4 justify-between items-center"
    >
      <div class="flex items-center">
        <img class="w-12 rounded-xs" :src="dish.dish.image" alt="" />
        <div class="ml-3">
          <div class="">{{ dish.dish.name }}</div>
          <div class="text-sm text-gray">x{{ dish.quantity }}</div>
        </div>
      </div>
      <div class="text-primary font-bold">
        {{ $filter.formatCurrency(dish.dish.price)
        }}<span class="text-xxs align-text-top">đ</span>
      </div>
    </div>
    <div class="border-t border-light-gray mt-4 pt-2 w-full text-right">
      <span>Tổng tiền:</span>
      <span class="text-lg ml-3 text-primary font-bold"
        >{{ $filter.formatCurrency(order.total_price) }}đ</span
      >
    </div>
  </div>
</template>

<script setup>
import { toRefs } from "@vue/reactivity";
import { computed } from "@vue/runtime-core";

const props = defineProps({
  order: {
    type: Object,
    required: true,
  },
});

const { order } = toRefs(props);

const date = computed(() => {
  const date = new Date(order.value.createdAt);
  return date.toLocaleDateString("vi", {
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "numeric",
  });
});
</script>

<style lang="css" scoped></style>
