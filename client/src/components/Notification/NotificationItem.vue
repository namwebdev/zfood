<template>
  <div
    class="
      w-64
      rounded-lg
      shadow-sm
      mb-4
      px-6
      pt-1
      pb-4
      text-white
      cursor-pointer
      transition
      duration-200
      ease-in-out
    "
    :class="notiType"
    @click="onClose"
  >
    <div class="capitalize font-bold">{{ notiType }}</div>
    <div class="text-sm" v-html="message"></div>
  </div>
</template>

<script>
import { computed } from "vue";
const types = ["success", "warning", "error"];
const typeText = ["Thành công", "Cảnh báo", "Lỗi"];
export default {
  props: {
    type: {
      type: String,
      validator(value) {
        return types.includes(value);
      },
      default: () => "error",
    },
    message: {
      type: String,
      default: () => "Xảy ra lỗi",
    },
    timer: {
      type: Number,
      default: () => 4000,
    },
  },
  emits: ["close"],
  setup(props, { emit }) {
    const notiType = computed(() => {
      if (types.includes(props.type)) return props.type;
      return "error";
    });
    autoCloseHanlder();
    function autoCloseHanlder() {
      setTimeout(() => onClose(), props.timer);
    }
    function onClose() {
      emit("close");
    }
    return { notiType, onClose };
  },
};
</script>

<style lang="css">
.success {
  @apply bg-green-300 hover:bg-green-600;
}
.warning {
  @apply bg-yellow-300 hover:bg-yellow-500;
}
.error {
  @apply bg-red-300 hover:bg-red-500;
}
</style>