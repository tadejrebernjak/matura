<template>
  <Transition name="fade">
    <div class="alert-bg" @click="$emit('cancel')" v-if="open"></div>
  </Transition>
  <Transition name="fade">
    <div class="alert" v-if="open">
      <h1 class="text-xl font-semibold mb-7">{{ text }}</h1>
      <div class="text-center">
        <button class="bg-green-500 hover:bg-green-400" @click="$emit('ok')">
          OK
        </button>
        <button class="bg-red-500 hover:bg-red-400" @click="$emit('cancel')">
          Prekliči
        </button>
      </div>
      <i class="fas fa-window-close" @click="$emit('cancel')"></i>
    </div>
  </Transition>
</template>

<script>
export default {
  name: "Alert",
  components: {},
  props: ["text", "open"],
  emits: ["ok", "cancel"],
  data() {
    return {};
  },
  methods: {},
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

.alert {
  position: fixed;
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);
  padding: 75px;
  @apply bg-gray-100 rounded-sm shadow-md;
}

.alert-bg {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  @apply bg-black bg-opacity-20;
}

button {
  @apply py-2 mx-2 w-20 font-semibold text-lg text-white;
}

i {
  @apply text-gray-600 text-2xl hover:text-gray-500 cursor-pointer absolute top-1 right-2;
}
</style>
