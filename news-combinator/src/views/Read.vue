<template>
  <h1 class="text-3xl border-b border-gray-600 pb-4 mb-10">
    <router-link to="/">Domov</router-link>
    <span v-if="authenticated">
      > <router-link to="/dashboard">Nadzorna Plošča</router-link></span
    >
    > <span class="text-green-600">Nedavno prebrano</span>
  </h1>
  <Searchbar @search="search" />
  <Paginator
    v-if="pages > 1"
    :pages="pages"
    :currentPage="currentPage"
    @changePage="changePage"
  />
  <ArticlesListRead :articles="shownArticles" />
  <Paginator
    v-if="pages > 1"
    :pages="pages"
    :currentPage="currentPage"
    @changePage="changePage"
  />
</template>

<script>
import { mapGetters } from "vuex";
import ArticlesListRead from "@/components/ArticlesListRead";
import ArticlesService from "../articlesService";
import Paginator from "@/components/Paginator";
import Searchbar from "@/components/Searchbar";

import moment from "moment";
import "moment/locale/sl";
moment.locale("sl");

export default {
  name: "Read",
  components: {
    ArticlesListRead,
    Paginator,
    Searchbar,
  },
  data() {
    return {
      articles: [],
      queriedArticles: [],
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
        this.articles = await ArticlesService.getReadArticles();

        for (let i = 0; i < this.articles.length; i++) {
          let visit = this.articles[i].clicks.find(
            (e) => e.userID == this.user._id
          );

          let time = moment(visit.createdAt).fromNow();

          this.articles[i].readAgo = time;
          this.articles[i].readAt = visit.createdAt;
        }

        this.articles.sort(function (a, b) {
          return new Date(b.readAt) - new Date(a.readAt);
        });

        this.queriedArticles = this.articles;
        this.pages = Math.ceil(this.queriedArticles.length / 10);

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
      this.shownArticles = this.queriedArticles.slice(
        (this.currentPage - 1) * 10,
        this.currentPage * 10
      );
    },
    search(query) {
      if (query != "") {
        this.queriedArticles = this.articles.filter((article) =>
          article.title.toLowerCase().includes(query)
        );
      } else {
        this.queriedArticles = this.articles;
      }
      this.pages = Math.ceil(this.queriedArticles.length / 10);

      this.changePageArticles();
    },
  },
  beforeMount() {
    this.getArticles();
  },
};
</script>
