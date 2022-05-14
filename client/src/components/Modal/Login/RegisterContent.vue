<template>
  <form>
    <div class="mb-2">
      <Input
        v-model="form.name"
        :error="error.name"
        :errorMessage="errorMessage.name"
        type="text"
        placeholder="Họ và tên"
      >
        <template #prefix>
          <UserIcon />
        </template>
      </Input>
    </div>
    <div class="mb-2">
      <Input
        v-model="form.address"
        :error="error.address"
        :errorMessage="errorMessage.address"
        type="text"
        placeholder="Địa chỉ"
      >
        <template #prefix><AddressIcon /> </template>
      </Input>
    </div>
    <div class="mb-2">
      <Input
        v-model="form.phone"
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
    <div class="mb-2">
      <Input
        v-model="form.password"
        :error="error.password"
        :errorMessage="errorMessage.password"
        type="password"
        placeholder="Mật khẩu"
      >
        <template #prefix>
          <PasswordIcon />
        </template>
      </Input>
    </div>
    <Input
      v-model="form.confirmPassword"
      :error="error.confirmPassword"
      :errorMessage="errorMessage.confirmPassword"
      type="password"
      placeholder="Nhập lại mật khẩu"
    >
      <template #prefix>
        <PasswordIcon />
      </template>
    </Input>
  </form>
  <div
    @click="signUp"
    class="cursor-pointer bg-primary hover:opacity-80 font-bold text-center text-white py-2 rounded-sm mt-4"
  >
    Đăng ký
  </div>
  <div class="text-sm text-center mt-8">
    Đã có tài khoản?
    <span @click="changeContent" class="text-primary cursor-pointer"
      >Đăng nhập ngay</span
    >
  </div>
</template>

<script>
import { reactive } from "vue";
import Input from "../../Input/Input.vue";
import PhoneIcon from "../../Icons/PhoneIcon.vue";
import PasswordIcon from "../../Icons/PasswordIcon.vue";
import { useNotificationStore, useModalStore } from "../../../stores";
import UserIcon from "../../Icons/UserIcon.vue";
import AddressIcon from "../../Icons/AddressIcon.vue";
import authApi from "../../../services/factory/auth";

export default {
  components: { Input, PhoneIcon, PasswordIcon, UserIcon, AddressIcon },
  emits: ["onChangeContent", "onSuccess"],
  setup({ emit }) {
    const form = reactive({
      name: "",
      address: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });
    const error = reactive({
      name: false,
      address: false,
      phone: false,
      password: false,
      confirmPassword: false,
    });
    const errorMessage = reactive({
      name: "",
      address: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });
    const notify = useNotificationStore();
    const modal = useModalStore();

    function changeContent() {
      modal.changeLoginContent();
      reset();
    }
    async function signUp() {
      const isValid = validate();
      if (!isValid) return;

      try {
        const data = await authApi.register(form);
        if (data) {
          notify.on({
            type: "success",
            message: "Đăng kí thành công.<br/>Bạn có thể đăng nhập ngay",
            timer: 6000,
          });
          clear();
          changeContent();
        }
      } catch (e) {
        if (e?.response?.data) {
          return;
        }
        notify.on({ message: "Xảy ra lỗi" + e });
      }
    }
    function validate() {
      reset();

      if (!form.name) {
        error.name = true;
        errorMessage.name = "Vui lòng nhập họ và tên";
      }
      if (!form.address) {
        error.address = true;
        errorMessage.address = "Vui lòng nhập địa chỉ";
      }
      if (!form.phone) {
        error.phone = true;
        errorMessage.phone = "Vui lòng nhập số điện thoại";
      }
      if (!form.password) {
        error.password = true;
        errorMessage.password = "Vui lòng nhập mật khẩu";
      }
      if (!form.confirmPassword) {
        error.confirmPassword = true;
        errorMessage.confirmPassword = "Vui lòng lại mật khẩu";
      } else if (form.confirmPassword !== form.password) {
        error.confirmPassword = true;
        errorMessage.confirmPassword = "Mật khẩu không khớp";
      }
      if (
        error.name ||
        error.password ||
        error.confirmPassword ||
        error.phone ||
        error.password
      )
        return false;

      return true;
    }
    function reset() {
      error.name = false;
      error.address = false;
      error.phone = false;
      error.password = false;
      error.confirmPassword = false;

      errorMessage.name = "";
      errorMessage.address = "";
      errorMessage.phone = "";
      errorMessage.password = "";
      errorMessage.confirmPassword = "";
    }
    function clear() {
      form.name = "";
      form.address = "";
      form.phone = "";
      form.password = "";
      form.confirmPassword = "";
    }
    return {
      form,
      error,
      errorMessage,
      changeContent,
      signUp,
      reset,
    };
  },
};
</script>

<style scoped>
svg {
  @apply text-gray;
}
</style>
