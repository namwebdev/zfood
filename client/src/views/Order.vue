<template>
  <AppContainer>
    <div class="text-primary font-bold text-lg">Giỏ hàng</div>
    <div class="flex justify-between align-baseline">
      <div>
        <DishOrderItem
          v-for="dish in cart"
          :key="dish.id"
          :dish="dish"
          @decrement="decrement"
          @increment="increment"
        />
      </div>
      <!--  -->
      <div>
        <div>{{ $filter.formatCurrency(totalPrice) }}</div>
        <div @click="visibleOrder = true">Order</div>
      </div>
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
      <div>Bạn chắc chắn muốn bỏ món ăn này khỏi giỏ hàng?</div>
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
          Tổng tiền phải thanh toán là {{ $filter.formatCurrency(totalPrice) }}
        </div>
      </div>
    </template>
  </AppModal>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useCartStore, useNotificationStore } from "../stores";
import AppContainer from "../components/App/AppContainer.vue";
import AppModal from "../components/App/AppModal.vue";
import DishOrderItem from "../components/Dish/DishOrderItem.vue";
import { computed, ref } from "vue";

const cartStore = useCartStore();
const notify = useNotificationStore();
const { cart } = storeToRefs(cartStore);
const visible = ref(false);
const visibleOrder = ref(false);
const dishForRemove = ref(null);
const totalPrice = computed(() => {
  return cart.value.reduce((acc, dish) => {
    return acc + dish.price * dish.quantity;
  }, 0);
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
function submitOrder() {
  cartStore.clear();
  notify.on({ type: "success", message: "Đặt hàng thành công" });
}
</script>
