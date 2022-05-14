<template>
  <div class="bg-white px-6 h-56 py-6 w-86 rounded-xs">
    <div class="border-b border-light-gray pb-2 mb-4 text-center">
      {{ userName }}
    </div>
    <div>
      <div class="flex items-center">
        <UserIcon />
        <span class="ml-2">Tài khoản của tôi</span>
      </div>
      <div class="ml-10">
        <div class="my-1">
          <router-link to="/profile/edit"> Hồ sơ </router-link>
        </div>
        <router-link to="/profile/change-password"> Đổi mật khẩu </router-link>
      </div>
    </div>
    <router-link to="/profile/order-history">
      <div class="flex items-center mt-3">
        <OrdersIcon />
        <span class="ml-2">Lịch sử đặt hàng</span>
      </div>
    </router-link>
  </div>
</template>

<script setup>
import { computed } from "@vue/runtime-core";
import { useAuthStore } from "../../stores";
import UserIcon from "../Icons/UserIcon.vue";
import OrdersIcon from "../Icons/OrdersIcon.vue";

const auth = useAuthStore();

const userName = computed(() => auth.user.name);
</script>

<style lang="css" scoped>
a.router-link-active.router-link-exact-active {
  @apply text-primary font-bold hover:opacity-70;
}
svg {
  @apply text-primary;
}
</style>
