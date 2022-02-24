<template>
  <h1 class="text-3xl border-b border-gray-600 pb-4 mb-10">
    Nedavno prebrane novice
  </h1>
  <ArticlesListRead :articles="articlesSorted" />
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
      articlesSorted: [],
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

        console.log("HELLO");
        for (let i = 0; i < this.articles.length; i++) {
          let visit = this.articles[i].clicks.find(
            (e) => e.userID == this.user._id
          );

          let time = moment(visit.createdAt).fromNow();

          this.articles[i].readAt = visit.createdAt;
          this.articles[i].readAgo = time;
        }

        this.articlesSorted = this.articles.sort((a, b) => b.readAt - a.readAt);
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
