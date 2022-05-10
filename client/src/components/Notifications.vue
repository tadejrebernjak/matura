<template>
  <div class="notifications-container">
    <ul>
      <li
        v-for="(notification, index) in notifications"
        :item="notification"
        :index="index"
        :key="index"
        :notification="notification"
      >
        <div
          class="notification"
          :class="{
            success: notification.type == 'success',
            error: notification.type == 'error',
          }"
        >
          {{ notification.message }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Notifications",
  props: {
    notifications: Array,
  },
};
</script>

<style scoped>
.notifications-container {
  @apply fixed right-0 top-20 z-50;
}

.notification {
  @apply py-2 px-6 my-1 text-gray-100 text-lg font-semibold text-right border-2 border-r-0 rounded-l-lg;
  animation: 5s ease-in-out slide;
}

.success {
  @apply bg-green-500 border-green-600;
}

.error {
  @apply bg-red-500 border-red-600;
}

@keyframes slide {
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  20% {
    transform: translateX(0px);
  }
  40% {
    opacity: 100;
  }
  60% {
    opacity: 100;
  }
  80% {
    transform: translateX(0px);
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
}
</style>
