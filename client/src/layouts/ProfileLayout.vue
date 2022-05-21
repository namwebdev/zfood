<template>
  <AppContainer v-if="auth.isLogin && auth.user" class="flex">
    <ProfileSideMenu />
    <slot />
  </AppContainer>
  <Unauthorized v-else />
</template>

<script setup>
import AppContainer from "../components/App/AppContainer.vue";
import ProfileIcon from "../components/Icons/ProfileIcon.vue";
import ProfileSideMenu from "../components/Profile/ProfileSideMenu.vue";
import Unauthorized from "../views/Unauthorized.vue";
import { useAuthStore } from "../stores";
const auth = useAuthStore();

</script>

<style lang="css" scoped></style>
