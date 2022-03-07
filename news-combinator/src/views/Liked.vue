<template>
  <h1 class="text-3xl border-b border-gray-600 pb-4 mb-10">Všečkane novice</h1>
  <Paginator
    v-if="pages > 1"
    :pages="pages"
    :currentPage="currentPage"
    @changePage="changePage"
  />
  <ArticlesListLiked :articles="articles" />
  <Paginator
    v-if="pages > 1"
    :pages="pages"
    :currentPage="currentPage"
    @changePage="changePage"
  />
</template>

<script>
import { mapGetters } from "vuex";
import ArticlesListLiked from "@/components/ArticlesListLiked";
import ArticlesService from "../articlesService";
import Paginator from "@/components/Paginator";

import moment from "moment";
import "moment/locale/sl";
moment.locale("sl");

export default {
  name: "Read",
  components: {
    ArticlesListLiked,
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
        this.articles = await ArticlesService.getLikedArticles();

        for (let i = 0; i < this.articles.length; i++) {
          let like = this.articles[i].likes.find(
            (e) => e.userID == this.user._id
          );

          let time = moment(like.createdAt).fromNow();

          this.articles[i].likedAgo = time;
          this.articles[i].likedAt = like.createdAt;
        }

        this.articles.sort(function (a, b) {
          return new Date(b.likedAt) - new Date(a.likedAt);
        });

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
