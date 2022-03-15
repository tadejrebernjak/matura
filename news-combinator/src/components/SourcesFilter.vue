<template>
  <div class="flex content-center justify-center flex-row flex-wrap">
    <button :class="{ selected: toggledSources.ur }" @click="toggle('24ur')">
      24ur
    </button>
    <button :class="{ selected: toggledSources.Delo }" @click="toggle('Delo')">
      Delo
    </button>
    <button :class="{ selected: toggledSources.Siol }" @click="toggle('Siol')">
      Siol
    </button>
    <button
      :class="{ selected: toggledSources.SlovenskeNovice }"
      @click="toggle('Slovenske Novice')"
    >
      Slovenske Novice
    </button>
  </div>
</template>

<script>
export default {
  name: "SourcesFilter",
  components: {},
  props: ["toggledSources"],
  emits: ["toggle"],
  data() {
    return {};
  },
  methods: {
    toggle(category) {
      this.$emit("toggle", category);
    },
  },
  beforeMount() {},
  watch: {},
};
</script>

<style scoped>
button {
  @apply p-1 px-3 mx-1 rounded-sm font-semibold text-white bg-gray-400 transition-all duration-300;
}

button.selected {
  @apply bg-green-500;
}
</style>
