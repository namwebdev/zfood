<template>
  <div>App</div>
</template>

<script setup lang="ts">
import { api } from './services';

const data = await api.restaurant.getAll()
console.log(data)
</script>

<style scoped></style>
