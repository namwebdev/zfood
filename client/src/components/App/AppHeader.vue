<template>
  <header
    class="h-16 bg-white z-10 shadow-sm fixed inset-0 w-full flex justify-between items-center px-20"
  >
    <div id="logo">
      <router-link to="/" class="w-52 hover:opacity-75">
        <img src="../../assets/logo.png" alt="" />
      </router-link>
    </div>
    <div class="w-full flex justify-center items-center">
      <SearchBar />
    </div>
    <div class="w-52">
      <div v-if="auth.isLogin" class="flex items-center justify-between w-52">
        <router-link to="/order" class="relative">
          <CartIcon class="cart" />
          <div
            class="absolute -top-1 right-0 rounded-circle text-xxs w-3 h-3 bg-white text-primary flex justify-center items-center"
          >
            {{ dishInCartCount }}
          </div>
        </router-link>
        <div
          class="relative"
          @mouseover="show = true"
          @mouseleave="show = false"
        >
          <div
            id="profile"
            class="flex justify-between items-center cursor-pointer"
          >
            <ProfileIcon />
            <div class="text-primary">{{ userName }}</div>
          </div>
          <div v-show="show" class="absolute duration-100">
            <router-link to="/profile/edit">
              <div
                class="cursor-pointer hover:bg-primary hover:text-white top-8 text-primary text-xs w-full text-center py-1 bg-white rounded-xs"
                style="min-width: 80px"
              >
                Hồ sơ
              </div>
            </router-link>
            <div
              @click="logout"
              class="cursor-pointer hover:bg-primary hover:text-white top-8 text-primary text-xs w-full text-center py-1 bg-white rounded-xs"
              style="min-width: 80px"
            >
              Đăng xuất
            </div>
          </div>
        </div>
      </div>
      <!--  -->
      <div
        v-else
        @click="modal.openLogin"
        class="border px-3 py-2 text-center w-28 ml-auto rounded-sm border-primary text-primary cursor-pointer hover:bg-primary hover:text-white duration-100"
      >
        Đăng nhập
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, ref } from "@vue/runtime-core";
import { useModalStore, useAuthStore, useCartStore } from "../../stores";
import CartIcon from "../Icons/CartIcon.vue";
import ProfileIcon from "../Icons/ProfileIcon.vue";
import SearchBar from "../SearchBar.vue";

const modal = useModalStore();
const auth = useAuthStore();
const cart = useCartStore();
const show = ref(false);

const dishInCartCount = computed(() => {
  return cart.cart.reduce((acc, item) => acc + item.quantity, 0);
});
const userName = computed(() => {
  return auth.user.name;
});
function logout() {
  auth.logout();
  cart.clear();
  show.value = false;
}
</script>

<style lang="css" scoped>
#logo {
  min-width: 208px;
}
svg {
  @apply text-primary;
}
svg.cart {
  @apply hover:opacity-80 duration-100 cursor-pointer;
}
#profile:after {
  content: "";
  width: 100%;
  height: 10px;
  position: absolute;
  bottom: -8px;
}
</style>
