<template>
  <div class="searchbar-container">
    <div class="searchbar">
      <input @keyup.enter="search" type="text" v-model="query" />
      <button @click="search">
        <i class="fas fa-search text-xl"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Searchbar",
  components: {},
  emits: ["search"],
  data() {
    return {
      query: "",
    };
  },
  methods: {
    search() {
      this.$emit("search", this.query.trim().toLowerCase());
    },
  },
};
</script>

<style scoped>
.searchbar-container {
  @apply text-center my-5;
}

.searchbar {
  @apply w-full max-w-md p-1 pr-0 mx-auto my-1 border-2 border-gray-400 rounded-lg flex;
}

.searchbar:focus-within {
  @apply border-green-500;
}

input {
  @apply w-full p-1 text-lg focus:outline-none;
}

button {
  @apply px-3 border-l-2 border-gray-400 text-gray-400 hover:text-green-500 hover:border-green-500;
}
</style>
