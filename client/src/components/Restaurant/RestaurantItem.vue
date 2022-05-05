<template>
  <router-link
    :to="{ path: `/restaurants/${restaurant.id}` }"
    class="h-72 bg-white rounded-lg overflow-hidden relative"
  >
    <div>
      <img :src="restaurant.image" />
    </div>
    <div class="px-5 mt-4 pb-3 border-b border-light-gray">
      <div class="font-bold">{{ restaurant.name }}</div>
      <div class="text-sm">{{ restaurant.address }}</div>
    </div>
    <div class="px-5 pt-2 text-xxs text-gray">{{ restaurant.category }}</div>
  </router-link>
</template>

<script setup>
import { defineProps, toRefs } from "vue";

const props = defineProps({
  restaurant: {
    type: Object,
  },
});

const { restaurant } = toRefs(props);
</script>

<style scoped>
div {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
img {
  width: 100%;
  max-height: 175px;
  object-fit: contain;
}
</style>
