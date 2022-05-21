<template>
  <ProfileLayout>
    <div class="bg-white ml-8 rounded-xs px-10 py-6 w-full">
      <div class="border-b border-light-gray pb-2">
        <div class="text-xl">Đổi mật khẩu</div>
        <div class="text-gray">
          Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
        </div>
      </div>
      <form class="mt-6 w-100 mx-auto">
        <div class="form-item">
          <div class="label">Mật khẩu hiện tại</div>
          <Input
            type="password"
            class="input"
            v-model="form.password"
            :error="error.password"
            :errorMessage="errorMessage.password"
          />
        </div>
        <div class="form-item">
          <div class="label">Mật khẩu mới</div>
          <Input
            type="password"
            class="input"
            v-model="form.new_password"
            :error="error.new_password"
            :errorMessage="errorMessage.new_password"
          />
        </div>
        <div class="form-item">
          <div class="label">Xác nhận mật khẩu</div>
          <Input
            type="password"
            class="input"
            v-model="form.confirm_password"
            :error="error.confirm_password"
            :errorMessage="errorMessage.confirm_password"
          />
        </div>
        <div class="form-item">
          <div class="label"></div>
          <div class="input">
            <Button :loading="loading" @click="changePassword"> Đổi mật khẩu </Button>
          </div>
        </div>
      </form>
    </div>
  </ProfileLayout>
</template>

<script setup>
import ProfileLayout from "../layouts/ProfileLayout.vue";
import Input from "../components/Input/Input.vue";
import { useAuthStore, useNotificationStore } from "../stores";
import { computed, reactive } from "@vue/runtime-core";
import Button from "../components/Button.vue";
import userApi from "../services/factory/user.js";
import { ref } from "vue";

const auth = useAuthStore();
const notify = useNotificationStore();

const form = reactive({
  password: "",
  new_password: "",
  confirm_password: "",
});
const error = reactive({
  password: false,
  new_password: false,
  confirm_password: false,
});
const errorMessage = reactive({
  password: "",
  new_password: "",
  confirm_password: "",
});

const loading = ref(false);

async function changePassword() {
  const checkValid = isValid();
  if (!checkValid) return;
  try {
    loading.value = true;
    const { confirm_password, ...formData } = form;
    const res = await userApi.changePassword(formData);
    if (res) {
      notify.on({ type: "success", message: "Đổi mật khẩu thành công" });
      form.password = "";
      form.new_password = "";
      form.confirm_password = "";
    }
  } catch (e) {
    const { message } = e.response.data;
    if (message) {
      if (message === "New password must be different") {
        notify.on({ message: "Mật khẩu mới không được giống mật khẩu cũ" });
        return;
      }
      if (message === "Old password is incorrect") {
        notify.on({ message: "Mật khẩu cũ không chính xác" });
        return;
      }
    }
    notify.on({ message: e });
  } finally {
    loading.value = false;
  }
}
function isValid() {
  let isValid = true;
  reset();
  if (!form.password) {
    error.password = true;
    errorMessage.password = "Vui lòng nhập mật khẩu cũ";
    isValid = false;
  }
  if (!form.new_password) {
    error.new_password = true;
    errorMessage.new_password = "Vui lòng nhập mật khẩu mới";
    isValid = false;
  }
  if (!form.confirm_password) {
    error.confirm_password = true;
    errorMessage.confirm_password = "Vui lòng nhập lại mật khẩu mới";
    isValid = false;
  }
  if (form.new_password !== form.confirm_password) {
    error.confirm_password = true;
    errorMessage.confirm_password = "Mật khẩu không khớp";
    isValid = false;
  }
  return isValid;
}
function reset() {
  error.password = false;
  error.new_password = false;
  error.confirm_password = false;
  errorMessage.password = "";
  errorMessage.new_password = "";
  errorMessage.confirm_password = "";
}
</script>

<style lang="css" scoped>
.form-item {
  width: 420px;
  @apply flex items-center mb-4;
}
.label {
  @apply w-40 text-sm text-right mr-4;
}
.input {
  @apply w-96;
}
</style>
