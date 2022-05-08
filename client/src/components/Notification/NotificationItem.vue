<template>
  <div
    class="w-64 rounded-lg shadow-sm mb-4 px-6 pt-1 pb-3 text-white cursor-pointer transition duration-200 ease-in-out"
    :class="notiType"
    @click="onClose"
  >
    <div class="capitalize font-bold">{{ notiTitle }}</div>
    <div class="text-sm" v-html="message"></div>
  </div>
</template>

<script>
import { computed } from "vue";

const types = [
  { type: "success", text: "Thành công" },
  { type: "warning", text: "Cảnh báo" },
  { type: "error", text: "Lỗi" },
];

export default {
  props: {
    type: {
      type: String,
      validator(value) {
        return types.some((type) => type.type === value);
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
      if (types.some((type) => type.type === props.type)) return props.type;
      return "error";
    });
    const notiTitle = computed(() => {
      const index = types.findIndex((type) => type.type === props.type);
      if (index !== -1) return types[index].text;
      return "Lỗi";
    });

    autoCloseHanlder();
    function autoCloseHanlder() {
      setTimeout(() => onClose(), props.timer);
    }
    function onClose() {
      emit("close");
    }
    return { notiType, notiTitle, onClose };
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
