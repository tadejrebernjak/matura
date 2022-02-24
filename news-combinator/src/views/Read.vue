<template>
  <h1 class="text-3xl border-b border-gray-600 pb-4 mb-10">Nedavno prebrano</h1>
  <ArticlesListRead :articles="articles" />
</template>

<script>
import { mapGetters } from "vuex";
import ArticlesListRead from "@/components/ArticlesListRead";
import ArticlesService from "../articlesService";

import moment from "moment";
import "moment/locale/sl";
moment.locale("sl");

export default {
  name: "Read",
  components: {
    ArticlesListRead,
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