<template>
  <AppHeader />
  <section class="py-10">
    <RouterView />
  </section>
  <AppFooter />
</template>

<script setup>
import AppHeader from "./components/App/AppHeader.vue";
import AppFooter from "./components/App/AppFooter.vue";
</script>
