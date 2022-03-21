<template>
  <div class="flex">
    <div class="mr-2">
      <button class="order" @click="toggle">
        <i class="fas fa-sort-amount-down"></i> Razvrsti po
      </button>
    </div>
    <ul class="options" v-if="showing">
      <li :class="{ selected: order === 'newest' }" @click="select('newest')">
        Najnovejše
      </li>
      <li :class="{ selected: order === 'oldest' }" @click="select('oldest')">
        Najstarejše
      </li>
      <li :class="{ selected: order === 'popular' }" @click="select('popular')">
        Priljubljeno
      </li>
    </ul>
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
.order {
  @apply p-2 bg-green-500 text-white font-semibold rounded-sm;
}

.options {
  @apply inline w-max z-50 shadow-md;
}

li {
  @apply text-center w-32 font-semibold text-white cursor-pointer bg-gray-400 hover:bg-gray-500 p-1 px-2 transition-all;
}

li.selected {
  @apply bg-green-500;
}
</style>
