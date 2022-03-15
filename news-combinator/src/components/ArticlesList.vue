<template>
  <Searchbar @search="search" />
  <SourcesFilter :toggledSources="toggledSources" @toggle="toggleSource" />
  <Paginator
    v-if="pages > 1"
    :pages="pages"
    :currentPage="currentPage"
    @changePage="changePage"
  />
  <div
    class="grid mt-5 md:grid-cols-3 sm:grid-cols-2 gap-4 grid-flow-row place-content-center"
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
import SourcesFilter from "@/components/SourcesFilter";

export default {
  name: "ArticlesList",
  components: {
    Paginator,
    Searchbar,
    NewsCardThin,
    SourcesFilter,
  },
  data() {
    return {
      articles: [],
      filteredArticles: [],
      shownArticles: [],
      pages: 10,
      currentPage: 1,
      toggledSources: {
        ur: true,
        Delo: true,
        Siol: true,
        SlovenskeNovice: true,
        list: ["24ur", "Delo", "Siol", "Slovenske Novice"],
      },
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
        this.filterArticles();

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
      this.shownArticles = this.filteredArticles.slice(
        (this.currentPage - 1) * 30,
        this.currentPage * 30
      );
    },
    async search(query) {
      if (query != "") {
        if (this.$route.params.category == "sport") {
          this.articles = await ArticlesService.searchArticles(query, "sport");
        } else if (this.$route.params.category == "chronicle") {
          this.articles = await ArticlesService.searchArticles(
            query,
            "chronicle"
          );
        } else {
          this.articles = await ArticlesService.searchArticles(query, "all");
        }
      } else {
        if (this.$route.params.category == "sport")
          this.articles = await ArticlesService.getArticles("sport");
        else if (this.$route.params.category == "chronicle")
          this.articles = await ArticlesService.getArticles("chronicle");
        else this.articles = await ArticlesService.getArticles("all");
      }
      this.filterArticles();

      this.changePageArticles();
    },
    toggleSource(category) {
      if (category == "24ur") {
        this.toggledSources.ur = !this.toggledSources.ur;

        if (this.toggledSources.ur) {
          this.toggledSources.list.push("24ur");
        } else {
          const index = this.toggledSources.list.indexOf("24ur");
          this.toggledSources.list.splice(index, 1);
        }
      } else if (category == "Slovenske Novice") {
        this.toggledSources.SlovenskeNovice =
          !this.toggledSources.SlovenskeNovice;

        if (this.toggledSources.SlovenskeNovice) {
          this.toggledSources.list.push("Slovenske Novice");
        } else {
          const index = this.toggledSources.list.indexOf("Slovenske Novice");
          this.toggledSources.list.splice(index, 1);
        }
      } else {
        this.toggledSources[category] = !this.toggledSources[category];

        if (this.toggledSources[category]) {
          this.toggledSources.list.push(category);
        } else {
          const index = this.toggledSources.list.indexOf(category);
          this.toggledSources.list.splice(index, 1);
        }
      }

      this.filterArticles();
    },
    filterArticles() {
      this.filteredArticles = this.articles.filter((article) =>
        this.toggledSources.list.includes(article.source)
      );

      this.pages = Math.ceil(this.filteredArticles.length / 30);

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
