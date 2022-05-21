<template>
  <AppContainer v-if="isLogin">
    <div class="text-primary font-bold text-xl mb-4">Giỏ hàng</div>
    <!--  -->
    <div v-if="cart.length" class="flex justify-between align-baseline">
      <div class="bg-white px-12 py-10 rounded-xs">
        <DishOrderItem
          v-for="dish in cart"
          :key="dish.id"
          :dish="dish"
          @decrement="decrement"
          @increment="increment"
        />
      </div>
      <!--  -->
      <div class="w-96">
        <div class="bg-white rounded-xs px-6 py-4">
          <div class="text-sm text-gray">Giao tới</div>
          <div class="flex items-center justify-between mt-2">
            <div class="font-bold">{{ name }}</div>
            <div class="text-light-gray opacity-90">|</div>
            <div class="font-bold">{{ phone }}</div>
          </div>
          <div>
            {{ address }}
          </div>
        </div>
        <div
          class="flex items-center justify-between bg-white rounded-xs px-6 py-4 mt-5"
        >
          <div class="text-sm">Tổng tiền:</div>
          <div class="text-primary font-bold text-lg">
            {{ $filter.formatCurrency(totalPrice) }}đ
          </div>
        </div>
        <div
          @click="visibleOrder = true"
          class="mt-5 font-bold text-white bg-primary text-center text-lg rounded-sm py-2 cursor-pointer duration-100 hover:opacity-80"
        >
          Đặt hàng
        </div>
      </div>
    </div>
    <!--  -->
    <div v-else class="text-center bg-white py-20 rounded-xs">
      <div class="text-xl font-bold mb-4">
        Không có món ăn nào trong giỏ hàng
      </div>
      <router-link to="/">
        <div
          class="flex text-center w-48 border mx-auto py-2 rounded-xs bg-primary text-white hover:text-primary hover:bg-white hover:border-primary duration-100"
        >
          <HomeIcon /> Trở về trang chủ
        </div>
      </router-link>
    </div>
  </AppContainer>
  <AppContainer v-else>
    <div class="text-center py-20 text-xl text-primary font-bold">
      Bạn cần đăng nhập trước khi truy cập vào trang này
    </div>
  </AppContainer>
  <!--  -->
  <AppModal
    v-model:visible="visible"
    @onOk="submitRemove"
    @hide="dishForRemove = null"
  >
    <template #title>
      <div class="font-bold text-lg text-primary">Xác nhận bỏ món ăn</div>
    </template>
    <template #body>
      <div class="mb-3">Bạn chắc chắn muốn bỏ món ăn này khỏi giỏ hàng?</div>
    </template>
  </AppModal>
  <!--  -->
  <AppModal v-model:visible="visibleOrder" @onOk="submitOrder">
    <template #title>
      <div class="font-bold text-lg text-primary">Xác nhận đặt hàng</div>
    </template>
    <template #body>
      <div>
        Bạn muốn đặt đơn hàng này?
        <div>
          Tổng tiền phải thanh toán là
          <span class="text-primary font-bold"
            >{{ $filter.formatCurrency(totalPrice) }}đ</span
          >
        </div>
      </div>
    </template>
  </AppModal>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useAuthStore, useCartStore, useNotificationStore } from "../stores";
import AppContainer from "../components/App/AppContainer.vue";
import AppModal from "../components/App/AppModal.vue";
import DishOrderItem from "../components/Dish/DishOrderItem.vue";
import { computed, ref } from "vue";
import HomeIcon from "../components/Icons/HomeIcon.vue";
import SadFaceIcon from "../components/Icons/SadFaceIcon.vue";
import { useRouter } from "vue-router";
import orderApi from "../services/factory/order";

const cartStore = useCartStore();
const notify = useNotificationStore();
const { cart } = storeToRefs(cartStore);
const auth = useAuthStore();
const visible = ref(false);
const visibleOrder = ref(false);
const dishForRemove = ref(null);
const totalPrice = computed(() => {
  return cart.value.reduce((acc, dish) => {
    return acc + dish.price * dish.quantity;
  }, 0);
});
const router = useRouter();

const isLogin = computed(() => {
  return auth.isLogin;
});

const name = computed(() => {
  return auth.user.name;
});
const phone = computed(() => {
  return auth.user.phone;
});
const address = computed(() => {
  return auth.user.address;
});

function decrement(dish, quantity) {
  if (quantity === 1) {
    visible.value = true;
    dishForRemove.value = dish;
    return;
  }
  cartStore.decrement(dish);
}
function increment(dish) {
  cartStore.add(dish);
}
function submitRemove() {
  cartStore.remove(dishForRemove.value);
}
async function submitOrder() {
  try {
    const dishes = cart.value.map((dish) => {
      return {
        dish_id: dish.id,
        quantity: dish.quantity,
      };
    });
    const data = await orderApi.order(cartStore.restauranId, totalPrice.value, dishes);
    if (data) {
      cartStore.clear();
      notify.on({ type: "success", message: "Đặt hàng thành công" });
      router.push("/");
    }
  } catch (error) {
    if (error.response?.data) return;
    notify.on({ message: "Xảy ra lỗi " + err });
  }
}
</script>
