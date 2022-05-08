<template>
  <div class="flex items-center justify-between w-110 mb-3 pb-3 border-b border-light-gray-800">
    <div class="flex items-center">
      <img class="w-20 rounded-xs" :src="dish.image" alt="" />
      <div class="ml-3 font-bold">
        <div>{{ dish.name }}</div>
        <div class="text-primary">
          {{ $filter.formatCurrency(dish.price)
          }}<span class="text-xxs align-text-top">đ</span>
        </div>
      </div>
    </div>
    <div class="flex items-center">
      <div
        class="flex items-center border-2 border-light-gray-800 rounded-xs h-7 mr-8"
      >
        <div
          @click="$emit('decrement', dish, quantity)"
          class="border-r-2 border-light-gray-800 px-2 cursor-pointer"
        >
          <MiniusIcon />
        </div>
        <div class="px-3">{{ quantity }}</div>
        <div
          @click="$emit('increment', dish)"
          class="border-l-2 border-light-gray-800 px-2 cursor-pointer"
        >
          <PlusIcon />
        </div>
      </div>

      <TrashIcon @click="$emit('decrement', dish, 1)" class="trash" />
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { computed, toRefs } from "vue";
import { useCartStore } from "../../stores";
import MiniusIcon from "../Icons/MiniusIcon.vue";
import PlusIcon from "../Icons/PlusIcon.vue";
import TrashIcon from "../Icons/TrashIcon.vue";

const props = defineProps({
  dish: {
    type: Object,
  },
});

const { dish } = toRefs(props);
const cartStore = useCartStore();
const { cart } = storeToRefs(cartStore);
const quantity = computed(() => {
  return cart.value.find((item) => item.id === dish.value.id)?.quantity ?? 0;
});
</script>

<style lang="css" scoped>
svg {
  @apply hover:text-primary duration-100;
}
svg.trash {
  @apply text-primary cursor-pointer hover:opacity-50;
}
</style>
