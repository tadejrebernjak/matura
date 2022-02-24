<template>
  <h1 class="text-3xl border-b border-gray-600 pb-4 mb-10">Všečkane novice</h1>
  <ArticlesListLiked :articles="articles" />
</template>

<script>
import { mapGetters } from "vuex";
import ArticlesListLiked from "@/components/ArticlesListLiked";
import ArticlesService from "../articlesService";

import moment from "moment";
import "moment/locale/sl";
moment.locale("sl");

export default {
  name: "Read",
  components: {
    ArticlesListLiked,
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
