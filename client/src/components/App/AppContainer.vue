<template>
  <div class="max-w-7xl m-auto" :class="{ 'mt-16': hasMargin }">
    <slot />
  </div>
</template>

<script setup>
import { toRefs } from "vue";

const props = defineProps({
  hasMargin: {
    type: Boolean,
    default: true,
  },
});

const { hasMargin } = toRefs(props);
</script>
