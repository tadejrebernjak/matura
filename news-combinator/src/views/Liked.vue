<template>
  <h1 class="text-3xl border-b border-gray-600 pb-4 mb-10">
    <router-link to="/">Domov</router-link>
    <span v-if="authenticated">
      > <router-link to="/dashboard">Nadzorna Plošča</router-link></span
    >
    > <span class="text-green-600">Všečkane novice</span>
  </h1>
  <Searchbar @search="search" />
  <Paginator
    v-if="pages > 1"
    :pages="pages"
    :currentPage="currentPage"
    @changePage="changePage"
  />
  <div :class="{ animating: animating }">
    <ArticlesListLiked :articles="shownArticles" />
  </div>
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
import Searchbar from "@/components/Searchbar";

import moment from "moment";
import "moment/locale/sl";
moment.locale("sl");

export default {
  name: "Read",
  components: {
    ArticlesListLiked,
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
      animating: false,
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
      this.fadeList();
    },
    changePageArticles() {
      this.shownArticles = this.queriedArticles.slice(
        (this.currentPage - 1) * 10,
        this.currentPage * 10
      );
      this.fadeList();
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
    fadeList() {
      this.animating = true;
      setTimeout(() => {
        this.animating = false;
      }, 1000);
    },
  },
  beforeMount() {
    this.getArticles();
  },
};
</script>

<style scoped>
.animating {
  animation: 1s ease-in-out fadeInOut;
}

@keyframes fadeInOut {
  0% {
    opacity: 100;
  }
  1% {
    opacity: 0;
  }
  100% {
    opacity: 100;
  }
}
</style>
