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
            class="w-110 mx-auto bg-white text-black pt-7 pb-4 px-5 rounded-sm shadow-sm h-auto"
            @click.stop=""
          >
            <div
              data-test="modal-title"
              class="font-bold text-xl text-center text-primary"
            >
              <span v-show="isLogin">Đăng nhập</span
              ><span v-show="!isLogin">Đăng ký</span>
            </div>

            <div class="w-86 mx-auto my-6">
              <div v-show="isLogin">
                <LoginContent
                  ref="loginContent"
                  @onChangeContent="onChangeContent"
                />
              </div>
              <div v-show="!isLogin">
                <RegisterContent />
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { storeToRefs } from "pinia";
import { onBeforeMount, onBeforeUnmount, ref, toRefs } from "vue";
import { useModalStore, useNotificationStore } from "../../../stores";
import LoginContent from "./LoginContent.vue";
import RegisterContent from "./RegisterContent.vue";

export default {
  name: "ModalLogin",
  props: {
    class: {
      type: String,
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
  emits: ["update:visible", "hide"],
  setup(props, { emit }) {
    const loginContent = ref(null);
    const store = useModalStore();
    const notify = useNotificationStore();
    const { login: visible } = storeToRefs(store);
    const { isLoginContent: isLogin } = storeToRefs(store);
    onBeforeMount(() => {
      window.addEventListener("keyup", onClosePressEscape);
    });
    onBeforeUnmount(() => {
      window.removeEventListener("keyup", onClosePressEscape);
    });

    function loginSuccess() {
      onClose();
      notify.on({ type: "success", message: "Đăng nhập thành công" });
    }
    function onChangeContent(value) {
      store.changeLoginContent(value);
    }
    function onClose() {
      loginContent.value.reset();
      loginContent.value.clear();

      store.closeLogin();
      emit("update:visible", false);
      emit("hide");
      setTimeout(() => onChangeContent(true), 200);
    }
    function onCloseClickMask() {
      if (props.closeOnClickOutside) onClose();
    }
    function onClosePressEscape(e) {
      if (e.which === 27 && props.closeOnPressEscape) onClose();
    }
    return {
      visible,
      isLogin,
      onChangeContent,
      onClose,
      onCloseClickMask,
      onClosePressEscape,
      loginContent,
      loginSuccess,
    };
  },
  components: { LoginContent, RegisterContent },
};
</script>
