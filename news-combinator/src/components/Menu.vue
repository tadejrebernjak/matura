<template>
  <Transition name="fade">
    <div class="menu-background" v-if="open" @click="close"></div>
  </Transition>
  <Transition name="slide-fade">
    <div class="menu" v-if="open">
      <div class="menu-head">
        <i class="fas fa-window-close text-3xl" @click="close"></i>
        <router-link to="/">
          <span class="text-4xl ml-10" @click="close">Novice</span>
        </router-link>
      </div>
      <div class="menu-body">
        <ul>
          <li>
            <router-link to="/news/sport" @click="close">
              <span class="text-xl uppercase">Šport</span>
            </router-link>
          </li>
          <li>
            <router-link to="/news/chronicle" @click="close">
              <span class="text-xl uppercase">Kronika</span>
            </router-link>
          </li>
          <li>
            <router-link to="/today" @click="close">
              <span class="text-xl uppercase">Danes</span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </Transition>
</template>

<script>
export default {
  name: "Menu",
  emits: ["closeMenu"],
  props: ["open"],
  data() {
    return {};
  },
  methods: {
    close() {
      this.$emit("closeMenu");
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.menu-background {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 90;
  @apply bg-black bg-opacity-20;
}

.menu {
  position: fixed;
  left: 0;
  min-height: 100vh;
  z-index: 100;
  @apply bg-gray-50 border-r border-gray-400;
}

.menu-head {
  @apply bg-gray-100 flex items-center justify-between p-5 border-b border-gray-300;
}

.menu-head i {
  @apply hover:text-gray-600 transition-all duration-100 cursor-pointer;
}

li {
  @apply text-center py-1 hover:bg-gray-200 transition-all duration-100;
}
</style>
