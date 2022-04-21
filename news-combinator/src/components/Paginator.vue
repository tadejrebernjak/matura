<template>
  <div class="paginator">
    <button @click="previousPage">&lt;</button>
    <div v-for="(page, index) in buttons" :item="page" :key="index">
      <button
        :class="{ selected: page.selected, first: page.first, last: page.last }"
        @click="changePage(page.page)"
      >
        {{ page.page }}
      </button>
    </div>
    <button @click="nextPage">></button>
  </div>
</template>

<script>
export default {
  name: "Paginator",
  components: {},
  props: ["pages", "currentPage"],
  emits: ["changePage"],
  data() {
    return {
      buttons: [],
    };
  },
  methods: {
    refreshPages() {
      this.buttons = [];

      if (this.currentPage - 2 > 1) this.addButton(1, "first");

      for (let i = this.currentPage - 2; i < this.currentPage + 3; i++) {
        if (i < 1 || i > this.pages) continue;
        this.addButton(i, null);
      }

      if (this.buttons.slice(-1).pop().page < this.pages)
        this.addButton(this.pages, "last");
    },
    addButton(i, option) {
      let button = {
        page: i,
        selected: false,
      };

      if (this.currentPage === i) button.selected = true;
      if (option == "first") button.first = true;
      if (option == "last") button.last = true;

      this.buttons.push(button);
    },
    changePage(newPage) {
      this.$emit("changePage", newPage);
    },
    previousPage() {
      if (this.currentPage - 1 > 0) this.changePage(this.currentPage - 1);
    },
    nextPage() {
      if (this.currentPage + 1 <= this.pages)
        this.changePage(this.currentPage + 1);
    },
  },
  beforeMount() {
    this.refreshPages();
  },
  watch: {
    currentPage: function () {
      this.refreshPages();
    },
    pages: function () {
      this.refreshPages();
    },
  },
};
</script>

<style scoped>
.paginator {
  @apply my-7 border-gray-500 flex flex-shrink justify-center;
}

button {
  @apply p-1 w-14 font-semibold text-gray-600 bg-gradient-to-b from-gray-100 hover:from-gray-200 to-gray-200 border border-gray-400;
  margin-left: -1px;
}

button.selected {
  @apply from-green-400 to-green-500 text-white;
}

button.first::after {
  content: "...";
  position: absolute;
  left: -2px;
}
</style>
