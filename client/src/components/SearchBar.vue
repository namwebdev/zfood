<template>
  <div
    class="input border border-light-gray py-2 px-3 w-full rounded-sm shadow-sm font-thin duration-100 shadow-gray-100 hover:shadow-lg flex justify-center items-center"
    :class="{
      'outline outline-0 shadow-lg border-primary-700': isFocus,
    }"
  >
    <div>
      <SearchIcon />
    </div>
    <input
      type="text"
      placeholder="Nhập tên quán ăn để tìm kiếm"
      class="w-full bg-transparent pl-2"
      @focus="isFocus = true"
      @blur="isFocus = false"
      v-model="search"
      @keyup.enter="handleSearch"
    />
    <div v-show="search">
      <CloseIcon class="cursor-pointer" size="15" @click.stop="clear" />
    </div>
  </div>
</template>

<script setup>
import Input from "./Input/Input.vue";
import SearchIcon from "./Icons/SearchIcon.vue";
import CloseIcon from "./Icons/CloseIcon.vue";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const search = ref("");

function handleSearch() {
  if (search.value) {
    router.push({
      path: "/",
      query: {
        search: search.value,
      },
    });
  } else {
    router.push({
      path: "/",
    });
  }
}
function clear() {
  search.value = "";
  if (route.path === "/")
    router.push({
      path: "/",
    });
}
</script>

<style lang="css" scoped>
.input {
  border-radius: 50px;
  height: 42px;
  width: 400px;
}
svg {
  @apply text-primary;
}
input:focus-visible {
  outline: none;
}
</style>
