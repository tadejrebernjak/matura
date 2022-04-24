<template>
  <div class="dropdown">
    <button class="dropdown-button" @click="toggle">
      <i class="fas fa-sort-amount-down"></i> Razvrsti po:
      <span v-if="order == 'newest'">Najnovejše</span
      ><span v-if="order == 'oldest'">Najstarejše</span
      ><span v-if="order == 'popular'">Priljubljeno</span>
    </button>
    <div class="dropdown-content" v-if="showing">
      <ul class="options">
        <li :class="{ selected: order === 'newest' }" @click="select('newest')">
          Najnovejše
        </li>
        <li :class="{ selected: order === 'oldest' }" @click="select('oldest')">
          Najstarejše
        </li>
        <li
          :class="{ selected: order === 'popular' }"
          @click="select('popular')"
        >
          Priljubljeno
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "OrderSelect",
  components: {},
  props: ["order"],
  emits: ["select"],
  data() {
    return {
      showing: false,
    };
  },
  methods: {
    toggle() {
      this.showing = !this.showing;
    },
    select(order) {
      this.$emit("select", order);

      this.showing = false;
    },
  },
};
</script>

<style scoped>
.dropdown {
  position: relative;
  display: inline-block;
  @apply my-2;
}

.dropdown-button {
  @apply p-2 w-52 bg-gray-400 hover:bg-gray-500 text-white font-semibold transition-all duration-150;
  position: relative;
}

.dropdown-content {
  position: absolute;
  @apply shadow-md z-50;
  max-height: 1000px;
  animation: 1s ease-in-out dropDown;
  overflow: hidden;
}

@keyframes dropDown {
  0% {
    max-height: 0px;
  }
  100% {
    max-height: 1000px;
  }
}

.options {
  @apply inline w-max z-50 shadow-md text-gray-600;
}

li {
  @apply text-center w-52 font-semibold cursor-pointer bg-gray-100 hover:bg-gray-200 border border-gray-300 p-1 px-2 transition-all;
  margin-top: -1px;
}

li.selected {
  @apply bg-green-400 hover:bg-green-500 text-white;
}
</style>
