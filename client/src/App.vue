<template>
  <AppHeader />
  <div class="py-10">
    <RouterView />
  </div>
  <AppFooter />
</template>

<script setup>
import AppHeader from "./components/App/AppHeader.vue";
import AppFooter from "./components/App/AppFooter.vue";
</script>
