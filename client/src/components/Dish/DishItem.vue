<template>
  <div class="flex border-b border-light-gray pb-3 mb-5">
    <div class="pt-1">
      <img :src="dish.image" alt="" />
    </div>
    <div class="ml-4 w-60">
      <div class="font-bold">{{ dish.name }}</div>
      <div class="text-xs">{{ dish.description }}</div>
    </div>
    <div class="font-bold text-primary ml-8 my-auto pb-5">
      {{ $filter.formatCurrency(dish.price)
      }}<span class="text-xxs align-text-top">đ</span>
    </div>
    <div class="ml-16 my-auto">
      <InCartIcon v-if="isInCart" class="opacity-50 text-primary" />
      <AddToCartIcon
        v-else
        @click="addToCart"
        class="text-primary cursor-pointer hover:opacity-50"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, toRefs } from "vue";
import AddToCartIcon from "../Icons/AddToCartIcon.vue";
import InCartIcon from "../Icons/InCartIcon.vue";
import { useCartStore } from "../../stores/";
import { useRoute } from "vue-router";

const props = defineProps({
  dish: {
    type: Object,
  },
});

const { dish } = toRefs(props);
const route = useRoute();
const cartStore = useCartStore();

const isInCart = computed(() => {
  return cartStore.cart.some((item) => item.id === dish.value.id);
});

function addToCart() {
  cartStore.add(dish.value, route.params.id);
}
</script>

<style scoped>
img {
  min-width: 60px;
  height: 60px;
}
</style>
