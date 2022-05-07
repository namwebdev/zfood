<template>
  <AppHeader />
  <section class="py-10">
    <RouterView />
  </section>
  <AppFooter />
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

const auth = useAuthStore();

fetchUserData();

async function fetchUserData() {
  try {
    const { data } = await authApi.getUser();
    if (data) auth.set(data);
  } catch (e) {
    if (e.response.status === 401) return;
    console.error("fetchUserData ", e);
  }
}
</script>
