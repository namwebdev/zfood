<template>
  <teleport to="body">
    <transition
      enter-active-class="transition ease-out duration-200 transform"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200 transform"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-show="visible"
        class="fixed z-20 inset-0 overflow-hidden bg-black bg-opacity-50"
        @click="onCloseClickMask"
        @keyup.esc="onClosePressEscape"
      >
        <div
          class="flex h-screen justify-center py-14 z-10"
          :class="{ 'items-center': isCenter }"
        >
          <div
            id="modal"
            data-test="modal"
            class="bg-white text-black rounded-sm shadow-sm h-auto px-8 pt-4 pb-6 w-100"
            :class="className"
            @click.stop=""
          >
            <slot name="title">
              <div data-test="modal-title" class="font-bold text-xl">Title</div>
            </slot>
            <div class="mt-2 mb-3">
              <slot name="body" />
            </div>
            <slot name="footer">
              <div class="text-right">
                <button
                  @click.stop="onClose"
                  class="bg-light-gray rounded-xs px-4 py-2 mr-1"
                >
                  Đóng
                </button>
                <button
                  @click.stop="onOk"
                  class="bg-primary text-white rounded-xs px-4 py-2"
                >
                  OK
                </button>
              </div>
            </slot>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { onBeforeMount, onBeforeUnmount } from "vue";
export default {
  name: "Modal",
  props: {
    visible: {
      type: Boolean,
      default: () => false,
    },
    className: {
      type: String,
      default: () => "",
    },
    isCenter: {
      type: Boolean,
      default: () => true,
    },
    closeOnClickOutside: {
      type: Boolean,
      default: () => true,
    },
    closeOnPressEscape: {
      type: Boolean,
      default: () => true,
    },
  },
  emits: ["update:visible", "onOk", "hide"],
  setup(props, { emit }) {
    onBeforeMount(() => {
      window.addEventListener("keyup", onClosePressEscape);
    });
    onBeforeUnmount(() => {
      window.removeEventListener("keyup", onClosePressEscape);
    });

    function onOk() {
      emit("onOk");
      onClose();
    }
    function onClose() {
      emit("update:visible", false);
      emit("hide");
    }
    function onCloseClickMask() {
      if (props.closeOnClickOutside) onClose();
    }
    function onClosePressEscape(e) {
      if (e.which === 27 && props.closeOnPressEscape) onClose();
    }
    return { onClose, onCloseClickMask, onClosePressEscape, onOk };
  },
};
</script>
