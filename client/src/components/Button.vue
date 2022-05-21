<template>
  <button
    @click="onClick"
    :disabled="loading"
    class="text-center text-white bg-primary border px-4 py-2 rounded-sm hover:text-primary hover:bg-white hover:border-primary duration-100"
    :class="{ 'disabled opacity-60 hover': loading }"
  >
    <div v-show="loading" class="spinner"></div>
    <div v-show="!loading"><slot /></div>
  </button>
</template>

<script setup>
import { toRefs } from "@vue/reactivity";

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
});

const { loading } = toRefs(props);
const emit = defineEmits(["click"]);
function onClick(e) {
  e.preventDefault();
  emit("click");
}
</script>

<style lang="css" scoped>
button.disabled:hover {
  @apply text-white bg-primary border-white cursor-wait;
}
.spinner {
  width: 20px;
  height: 20px;
  margin: 0 auto;
}
</style>
