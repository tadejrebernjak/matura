<template>
  <Menu @closeMenu="closeMenu" :open="menu" />
  <Header @openMenu="openMenu" />
  <div class="relative overflow-hidden">
    <Notifications :notifications="notifications" />
    <div class="container max-w-4xl mx-auto p-2 my-8" :class="{ fading: fade }">
      <router-view @notify="addNotification" />
    </div>
  </div>
  <button
    class="up-button fixed items-center justify-center text-xl bottom-5 right-5 z-50 w-8 h-8 text-gray-200 bg-green-400 hover:bg-green-500 border border-green-600 rounded-lg"
    @click="scrollUp"
  >
    <i class="fas fa-chevron-up"></i>
  </button>
  <Footer />
</template>

<script>
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Notifications from "@/components/Notifications";
import Menu from "@/components/Menu";

export default {
  components: {
    Header,
    Footer,
    Notifications,
    Menu,
  },
  data() {
    return {
      fade: false,
      menu: false,
      notifications: [],
    };
  },
  methods: {
    scrollUp() {
      window.scroll({ top: 0, behavior: "smooth" });
    },
    fadeContent() {
      this.fade = false;
      this.fade = true;
      setTimeout(() => {
        this.fade = false;
      }, 1000);
    },
    addNotification(notification) {
      const newNotification = {
        type: notification.type,
        message: notification.message,
        createdAt: Date.now(),
      };

      this.notifications.push(newNotification);

      setTimeout(() => {
        const index = this.notifications.indexOf(newNotification);

        this.notifications.splice(index, 1);
      }, 5000);
    },
    openMenu() {
      this.menu = true;
    },
    closeMenu() {
      this.menu = false;
    },
  },
  watch: {
    $route: function () {
      this.fadeContent();
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Fira+Sans&family=Nunito+Sans&display=swap");

* {
  font-family: "Nunito Sans", sans-serif;
}

h1,
h2,
h3 {
  font-family: "Fira Sans", sans-serif;
}

#app {
  padding-bottom: 125px;
  @apply min-h-screen relative;
}

.up-button {
  display: flex;
}

@media only screen and (max-width: 1000px) {
  .up-button {
    display: none;
  }
}

.fading {
  animation: 700ms ease-in-out fadeInOut;
}

@keyframes fadeInOut {
  0% {
    opacity: 100;
  }
  1% {
    opacity: 0;
  }
  100% {
    opacity: 100;
  }
}
</style>
