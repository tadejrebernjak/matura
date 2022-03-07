<template>
  <h1 class="text-3xl border-b border-gray-600 pb-4 mb-10">Novice dneva</h1>
  <Paginator
    v-if="pages > 1"
    :pages="pages"
    :currentPage="currentPage"
    @changePage="changePage"
  />
  <ArticlesListToday :articles="shownArticles" />
  <Paginator
    v-if="pages > 1"
    :pages="pages"
    :currentPage="currentPage"
    @changePage="changePage"
  />
</template>

<script>
import { mapGetters } from "vuex";
import ArticlesListToday from "@/components/ArticlesListToday";
import ArticlesService from "../articlesService";
import Paginator from "@/components/Paginator";

import moment from "moment";
import "moment/locale/sl";
moment.locale("sl");

export default {
  name: "Read",
  components: {
    ArticlesListToday,
    Paginator,
  },
  data() {
    return {
      articles: [],
      shownArticles: [],
      pages: 10,
      currentPage: 1,
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
        this.pages = Math.ceil(this.articles.length / 10);

        this.changePageArticles();
      } catch (error) {
        this.error = error.message;
      }
    },
    changePage(newPage) {
      this.currentPage = newPage;
      this.changePageArticles();
    },
    changePageArticles() {
      this.shownArticles = this.articles.slice(
        (this.currentPage - 1) * 10,
        this.currentPage * 10
      );
    },
  },
  beforeMount() {
    this.getArticles();
  },
};
</script>
