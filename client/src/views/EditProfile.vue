<template>
  <ProfileLayout>
    <div class="bg-white ml-8 rounded-xs px-10 py-6 w-full">
      <div class="border-b border-light-gray pb-2">
        <div class="text-xl">Hồ sơ</div>
        <div class="text-gray">
          Quản lý thông tin hồ sơ để bảo mật tài khoản
        </div>
      </div>
      <form class="flex flex-wrap justify-between mt-6">
        <div class="form-item">
          <div class="label">Họ và tên</div>
          <Input
            class="input"
            v-model="info.name"
            :error="error.name"
            :errorMessage="errorMessage.name"
          />
        </div>
        <div class="form-item">
          <div class="label">Số điện thoại</div>
          <Input
            type="number"
            class="input"
            v-model="info.phone"
            :error="error.phone"
            :errorMessage="errorMessage.phone"
          />
        </div>
        <div class="form-item">
          <div class="label">Địa chỉ</div>
          <Input
            class="input"
            v-model="info.address"
            :error="error.address"
            :errorMessage="errorMessage.address"
          />
        </div>
      </form>
      <div class="text-right">
        <Button @click="updateInfo"> Cập nhật </Button>
      </div>
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

const auth = useAuthStore();
const notify = useNotificationStore();

const userName = computed(() => auth.user.name);
const phone = computed(() => auth.user.phone);
const address = computed(() => auth.user.address);

const info = reactive({
  name: "",
  phone: "",
  address: "",
});
const error = reactive({
  name: false,
  phone: false,
  address: false,
});
const errorMessage = reactive({
  name: "",
  phone: "",
  address: "",
});

init();

function init() {
  info.name = userName.value;
  info.phone = phone.value;
  info.address = address.value;
}

async function updateInfo() {
  const checkValid = isValid();
  if (!checkValid) return;
  try {
    const res = await userApi.updateInfo(info);
    if (res) {
      notify.on({ type: "success", message: "Cập nhật thành công" });
      auth.update(info);
    }
  } catch (e) {
    notify.on({ message: e });
  }
}
function isValid() {
  let isValid = true;
  reset();
  if (!info.name) {
    error.name = true;
    errorMessage.name = "Họ và tên không được để trống";
    isValid = false;
  }
  if (!info.phone) {
    error.phone = true;
    errorMessage.phone = "Số điện thoại không được để trống";
    isValid = false;
  }
  if (!info.address) {
    error.address = true;
    errorMessage.address = "Địa chỉ không được để trống";
    isValid = false;
  }
  return isValid;
}
function reset() {
  error.name = false;
  errorMessage.name = "";
  error.phone = false;
  errorMessage.phone = "";
  error.address = false;
  errorMessage.address = "";
}
</script>

<style lang="css" scoped>
.form-item {
  width: 420px;
  @apply flex items-center mb-4;
}
.label {
  @apply w-28 text-sm;
}
.input {
  @apply w-96;
}
</style>
