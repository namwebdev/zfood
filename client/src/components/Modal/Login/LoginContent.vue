<template>
  <div v-show="error.incorrect" class="text-sm text-red-500 text-center mb-4">
    Số điện thoại hoặc mật khẩu không đúng
  </div>
  <form>
    <div class="mb-2">
      <Input
        v-model="phone"
        :error="error.phone"
        :errorMessage="errorMessage.phone"
        type="number"
        placeholder="Số điện thoại"
      >
        <template #prefix>
          <PhoneIcon />
        </template>
      </Input>
    </div>
    <Input
      v-model="password"
      :error="error.password"
      :errorMessage="errorMessage.password"
      type="password"
      placeholder="Mật khẩu"
    >
      <template #prefix>
        <PasswordIcon />
      </template>
    </Input>
  </form>
  <div
    @click="handleLogin"
    class="cursor-pointer bg-primary hover:opacity-80 font-bold text-center text-white py-2 rounded-sm mt-4"
  >
    Đăng nhập
  </div>
  <div class="text-sm text-center mt-8">
    Chưa có tài khoản?
    <span @click="changeContent()" class="text-primary">Đăng ký ngay</span>
  </div>
</template>

<script>
import { reactive, ref } from "vue";
import Input from "../../Input/Input.vue";
import PhoneIcon from "../../Icons/PhoneIcon.vue";
import PasswordIcon from "../../Icons/PasswordIcon.vue";
import authApi from "../../../services/factory/auth.js";
import {
  useNotificationStore,
  useModalStore,
  useAuthStore,
} from "../../../stores";

export default {
  components: { Input, PhoneIcon, PasswordIcon },
  emits: ["onChangeContent", "onSuccess"],
  setup({ emit }) {
    const phone = ref("");
    const password = ref("");
    const error = reactive({
      phone: false,
      password: false,
      incorrect: false,
    });
    const errorMessage = reactive({
      phone: "",
      password: "",
    });
    const notify = useNotificationStore();
    const modal = useModalStore();
    const auth = useAuthStore();

    function changeContent() {
      modal.changeLoginContent();
      reset();
    }
    async function handleLogin() {
      reset();

      if (!phone.value) {
        error.phone = true;
        errorMessage.phone = "Vui lòng nhập số điện thoại";
      }
      if (!password.value) {
        error.password = true;
        errorMessage.password = "Vui lòng nhập mật khẩu";
      }
      if (error.phone || error.password) return;
      try {
        const { token } = await authApi.login(phone.value, password.value);
        if (token) {
          localStorage.setItem("token", token);
          await fetchUser();

          notify.on({ type: "success", message: "Đăng nhập thành công" });
          modal.closeLogin();
          clear();
        }
      } catch (e) {
        if (e?.response?.data) {
          error.incorrect = true;
          error.phone = true;
          error.password = true;
          return;
        }
        notify.on({ message: "Xảy ra lỗi" + e });
      }
    }
    async function fetchUser() {
      try {
        const { data } = await authApi.getUser();
        if (data) auth.set(data);
      } catch (e) {
        throw e;
      }
    }
    function reset() {
      error.incorrect = false;
      error.phone = false;
      errorMessage.phone = "";
      error.password = false;
      errorMessage.password = "";
    }
    function clear() {
      phone.value = "";
      password.value = "";
    }
    return {
      error,
      errorMessage,
      changeContent,
      handleLogin,
      phone,
      password,
      reset,
      clear,
    };
  },
};
</script>

<style scoped>
svg {
  @apply text-gray;
}
</style>
