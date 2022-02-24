<template>
  <h1 class="text-3xl border-b border-gray-600 pb-4 mb-10">Novice dneva</h1>
  <ArticlesListToday :articles="articles" />
</template>

<script>
import { mapGetters } from "vuex";
import ArticlesListToday from "@/components/ArticlesListToday";
import ArticlesService from "../articlesService";

import moment from "moment";
import "moment/locale/sl";
moment.locale("sl");

export default {
  name: "Read",
  components: {
    ArticlesListToday,
  },
  data() {
    return {
      articles: [],
      error: "",
    };
  },
  computed: {
    ...mapGetters({
      authenticated: "auth/authenticated",
      user: "auth/user",
    }),
  },
  methods: {
    async getArticles() {
      try {
        this.articles = await ArticlesService.getTodayArticles();
      } catch (error) {
        this.error = error.message;
      }
    },
  },
  beforeMount() {
    this.getArticles();
  },
};
</script>
