<template>
  <teleport to="body">
    <div class="fixed z-50 right-5 top-5 overflow-hidden">
      <transition-group name="notifications">
        <notification-item
          v-for="notify in notifications"
          :key="notify.id"
          :type="notify.type"
          :message="notify.message"
          @close="closeNoti(notify.id)"
        />
      </transition-group>
    </div>
  </teleport>
</template>

<script>
import NotificationItem from "./NotificationItem.vue";
import { useNotificationStore } from "../../stores";
import { storeToRefs } from "pinia";

export default {
  components: { NotificationItem },
  setup() {
    const store = useNotificationStore();
    const { notifications } = storeToRefs(store);

    function closeNoti(id) {
      store.clear(id);
    }

    return { notifications, closeNoti };
  },
};
</script>

<style lang="css">
/* notifications transitions */
.notifications-enter-from {
  opacity: 0;
  transform: scale(0.6);
}
.notifications-enter-active {
  transition: all 0.4s ease;
}
.notifications-leave-to {
  opacity: 0;
  transform: scale(0.6);
}
.notifications-leave-active {
  transition: all 0.4s ease;
}
</style>
