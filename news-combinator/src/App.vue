<template>
  <Header />
  <div class="container max-w-4xl mx-auto p-2 my-8" :class="{ fading: fade }">
    <router-view />
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

export default {
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      fade: false,
    };
  },
  methods: {
    scrollUp() {
      window.scroll({ top: 0, behavior: "smooth" });
    },
    fadeContent() {
      this.fade = true;
      setTimeout(() => {
        this.fade = false;
      }, 1000);
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
