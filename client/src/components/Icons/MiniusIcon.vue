<template>
  <svg
    :width="size"
    :height="size"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 384 512"
  >
    <path
      d="M400 288h-352c-17.69 0-32-14.32-32-32.01s14.31-31.99 32-31.99h352c17.69 0 32 14.3 32 31.99S417.7 288 400 288z"
    />
  </svg>
</template>

<script setup>
import {  toRefs } from "vue";

const props = defineProps({
  size: {
    size: String,
    default: "15",
  },
});

const { size } = toRefs(props);
</script>
