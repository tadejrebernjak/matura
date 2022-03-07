<template>
  <div class="pagination">
    <div v-for="(page, index) in buttons" :item="page" :key="index">
      {{ page }}
    </div>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  components: {},
  props: ["pages", "currentPage"],
  data() {
    return {
      buttons: [],
    };
  },
  methods: {
    refreshPages() {
      for (let i = 1; i < this.pages; i++) {
        let button = {
          page: i,
          selected: false,
        };

        if (this.currentPage === i) button.selected = true;

        this.buttons.push(button);
      }
    },
    beforeMount() {
      this.refreshPages();
    },
  },
};
</script>
