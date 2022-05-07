<template>
  <div
    class="border border-light-gray py-2 px-3 w-full rounded-sm shadow-sm font-thin duration-100 shadow-gray-100 hover:shadow-lg flex justify-center items-center"
    :class="{
      'border-red-500': error,
      'outline outline-0 shadow-lg border-primary-700': isFocus,
    }"
  >
    <slot name="prefix"></slot>
    <input
      :type="type"
      :placeholder="placeholder"
      class="w-full bg-transparent pl-2"
      @focus="isFocus = true"
      @blur="isFocus = false"
      :value="modelValue"
      @input="updateValue"
    />
    <slot name="affix"></slot>
  </div>
  <div class="h-4">
    <div v-show="errorMessage" class="text-red-500 text-xs">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "Input",
  props: {
    type: {
      type: String,
      default: () => "text",
    },
    placeholder: {
      type: String,
      default: () => "",
    },
    modelValue: {
      type: String,
      default: () => "",
    },
    error: {
      type: Boolean,
      default: () => false,
    },
    errorMessage: {
      type: String,
      default: () => "",
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const isFocus = ref(false);
    const isDirty = ref(false);

    function updateValue(e) {
      emit("update:modelValue", e.target.value);
      isDirty.value = true;
    }

    return { isFocus, isDirty, updateValue };
  },
};
</script>

<style lang="css" scoped>
input:focus-visible {
  outline: none;
}
</style>
