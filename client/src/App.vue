<template>
  <AppHeader />
  <div v-if="loading" class="py-56"></div>
  <section v-else class="py-10">
    <RouterView />
  </section>
  <AppFooter />
  <div v-if="loading" class="absolute w-full h-full inset-0 z-20">
    <div class="bg-light-gray w-full h-full opacity-25"></div>
    <div
      class="absolute inset-0 w-full h-100 flex justify-center items-center pb-8"
    >
      <div>
        <div class="flex items-center">
          <span class="text-xl text-primary font-bold mr-1"
            >Chào mừng đến với</span
          >
          <img src="./assets/logo.png" alt="" />
        </div>
        <div class="text-center text-gray mt-8">
          Hệ thống đang tải, vui lòng đợi trong giây lát...
        </div>
        <div class="h-14 mt-5">
          <div class="progress"></div>
        </div>
      </div>
    </div>
  </div>

  <!--  -->
  <ModalLogin />
  <Notification />
</template>

<script setup>
import AppHeader from "./components/App/AppHeader.vue";
import AppFooter from "./components/App/AppFooter.vue";
import ModalLogin from "./components/Modal/Login/ModalLogin.vue";
import Notification from "./components/Notification/Notification.vue";
import authApi from "./services/factory/auth";
import { useAuthStore } from "./stores";
import { ref } from "vue";

const loading = ref(true);

const auth = useAuthStore();

init();

async function init() {
  try {
    const { data } = await authApi.getUser();
    if (data) auth.set(data);
  } catch (e) {
    if (e.response.status === 401) return;
    console.error("fetchUserData ", e);
  } finally {
    loading.value, false;
  }
}
</script>

<style scoped>
.progress {
  @apply text-primary mx-auto;
  width: 40px;
  height: 40px;
  background: linear-gradient(currentColor 0 0),
    linear-gradient(currentColor 0 0), linear-gradient(currentColor 0 0),
    linear-gradient(currentColor 0 0);
  background-size: 21px 21px;
  background-repeat: no-repeat;
  animation: sh5 1.5s infinite cubic-bezier(0.3, 1, 0, 1);
}
@keyframes sh5 {
  0% {
    background-position: 0 0, 100% 0, 100% 100%, 0 100%;
  }
  33% {
    background-position: 0 0, 100% 0, 100% 100%, 0 100%;
    width: 60px;
    height: 60px;
  }
  66% {
    background-position: 100% 0, 100% 100%, 0 100%, 0 0;
    width: 60px;
    height: 60px;
  }
  100% {
    background-position: 100% 0, 100% 100%, 0 100%, 0 0;
  }
}
</style>
