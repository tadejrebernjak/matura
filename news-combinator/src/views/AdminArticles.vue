<template>
  <Searchbar @search="search" />
  <SourcesFilter :toggledSources="toggledSources" @toggle="toggleSource" />
  <Paginator
    v-if="pages > 1"
    :pages="pages"
    :currentPage="currentPage"
    @changePage="changePage"
  />
  <OrderSelect :order="order" @select="orderSelect" />
  <table class="table-fixed">
    <tr>
      <th class="source">Source</th>
      <th class="title">Title</th>
      <th class="datetime">Date & Time</th>
      <th class="actions">Actions</th>
    </tr>
    <tr
      v-for="(article, index) in shownArticles"
      :item="article"
      :index="index"
      :key="article.id"
      :article="article"
    >
      <td>{{ article.source }}</td>
      <td>{{ article.title }}</td>
      <td>{{ article.date + " " + article.time }}</td>
      <td><i class="far fa-eye"></i></td>
    </tr>
  </table>
  <Paginator
    v-if="pages > 1"
    :pages="pages"
    :currentPage="currentPage"
    @changePage="changePage"
  />
</template>

<script>
import ArticlesService from "../articlesService";
import Paginator from "@/components/Paginator";
import Searchbar from "@/components/Searchbar";
import SourcesFilter from "@/components/SourcesFilter";
import OrderSelect from "@/components/OrderSelect";

export default {
  name: "ArticlesList",
  components: {
    Paginator,
    Searchbar,
    SourcesFilter,
    OrderSelect,
  },
  data() {
    return {
      articles: [],
      filteredArticles: [],
      shownArticles: [],
      pages: 10,
      currentPage: 1,
      order: "newest",
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

      this.orderArticles();
      this.changePageArticles();
    },
    orderSelect(order) {
      this.order = order;

      this.orderArticles();
      this.changePageArticles();
    },
    orderArticles() {
      switch (this.order) {
        case "newest":
          this.filteredArticles.sort((a, b) =>
            b.timestamp > a.timestamp ? 1 : -1
          );
          console.log("newest");
          break;
        case "oldest":
          this.filteredArticles.sort((a, b) =>
            a.timestamp > b.timestamp ? 1 : -1
          );
          console.log("oldest");
          break;
        case "popular":
          this.filteredArticles.sort(
            (a, b) =>
              b.likes.length - a.likes.length || b.timestamp - a.timestamp
          );
          break;
        default:
          this.filteredArticles.sort((a, b) =>
            b.timestamp > a.timestamp ? 1 : -1
          );
          break;
      }
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

<style scoped>
table {
  @apply my-5 rounded-sm;
}

th {
  @apply bg-green-500 border border-green-500 text-white font-semibold text-lg p-1 text-left;
}

td {
  @apply p-2 border border-gray-300;
}

tr:nth-child(even) {
  @apply bg-gray-100;
}
</style>
