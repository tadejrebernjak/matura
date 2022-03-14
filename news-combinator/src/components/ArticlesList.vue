<template>
  <Searchbar @search="search" />
  <Paginator
    v-if="pages > 1"
    :pages="pages"
    :currentPage="currentPage"
    @changePage="changePage"
  />
  <div
    class="grid md:grid-cols-3 sm:grid-cols-2 gap-4 grid-flow-row place-content-center"
  >
    <NewsCardThin
      v-for="(article, index) in shownArticles"
      :item="article"
      :index="index"
      :key="article.id"
      :article="article"
    />
  </div>
  <Paginator
    v-if="pages > 1"
    :pages="pages"
    :currentPage="currentPage"
    @changePage="changePage"
  />
</template>

<script>
import ArticlesService from "../articlesService";
import NewsCardThin from "@/components/NewsCardThin";
import Paginator from "@/components/Paginator";
import Searchbar from "@/components/Searchbar";

export default {
  name: "ArticlesList",
  components: {
    Paginator,
    Searchbar,
    NewsCardThin,
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
  methods: {
    async getArticles() {
      try {
        if (this.$route.params.category == "sport")
          this.articles = await ArticlesService.getArticles("sport");
        else if (this.$route.params.category == "chronicle")
          this.articles = await ArticlesService.getArticles("chronicle");
        else this.articles = await ArticlesService.getArticles("all");
        console.log("kronika");
        this.pages = Math.ceil(this.articles.length / 30);

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
        (this.currentPage - 1) * 30,
        this.currentPage * 30
      );
    },
    async search(query) {
      if (query != "")
        this.articles = await ArticlesService.searchArticles(query);
      else this.articles = await ArticlesService.getAllArticles();

      this.pages = Math.ceil(this.articles.length / 30);

      this.changePageArticles();
    },
  },
  beforeMount() {
    this.getArticles();
  },
  watch: {
    "$route.params.category": function () {
      this.getArticles();
    },
  },
};
</script>
