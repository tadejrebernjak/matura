<template>
  <h1 class="text-3xl border-b border-gray-600 pb-4 mb-10">
    <router-link to="/admin">Admin</router-link>
    > <span class="text-green-600">Novice</span>
  </h1>
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
    <tr class="rounded-t-md">
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
      <td>
        <router-link :to="'/article/' + article._id">{{
          article.title
        }}</router-link>
      </td>
      <td class="text-center">
        <p>{{ article.date }}</p>
        <p class="font-bold">{{ article.time }}</p>
      </td>
      <td>
        <div class="actions-container">
          <span @click="toggleVisibility(article._id)">
            <i v-if="!article.hidden" class="far fa-eye"></i>
            <i v-else class="far fa-eye-slash"></i>
            <div class="tooltip">
              <p v-if="!article.hidden">Hide</p>
              <p v-else>Unhide</p>
            </div>
          </span>
          <span @click="deleteArticleConfirm(article._id)">
            <i class="fas fa-trash"></i>
            <div class="tooltip">
              <p>Delete</p>
            </div>
          </span>
        </div>
      </td>
    </tr>
  </table>
  <Paginator
    v-if="pages > 1"
    :pages="pages"
    :currentPage="currentPage"
    @changePage="changePage"
  />
  <Alert
    :text="'Želite izbrisati članek?'"
    @ok="alertOK"
    @cancel="alertCancel"
    v-if="alert"
  />
</template>

<script>
import { mapGetters } from "vuex";
import AdminService from "../adminService";
import router from "../router";
import Paginator from "@/components/Paginator";
import Searchbar from "@/components/Searchbar";
import SourcesFilter from "@/components/SourcesFilter";
import OrderSelect from "@/components/OrderSelect";
import Alert from "@/components/Alert";

export default {
  name: "ArticlesList",
  components: {
    Paginator,
    Searchbar,
    SourcesFilter,
    OrderSelect,
    Alert,
  },
  emits: ["notify"],
  computed: {
    ...mapGetters({
      authenticated: "auth/authenticated",
      user: "auth/user",
      isAdmin: "auth/isAdmin",
    }),
  },
  data() {
    return {
      alert: false,
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
      deleteID: "",
      error: "",
    };
  },
  methods: {
    async getArticles() {
      try {
        if (this.$route.params.category == "sport")
          this.articles = await AdminService.getArticles("sport");
        else if (this.$route.params.category == "chronicle")
          this.articles = await AdminService.getArticles("chronicle");
        else this.articles = await AdminService.getArticles("all");
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
          this.articles = await AdminService.searchArticles(query, "sport");
        } else if (this.$route.params.category == "chronicle") {
          this.articles = await AdminService.searchArticles(query, "chronicle");
        } else {
          this.articles = await AdminService.searchArticles(query, "all");
        }
      } else {
        if (this.$route.params.category == "sport")
          this.articles = await AdminService.getArticles("sport");
        else if (this.$route.params.category == "chronicle")
          this.articles = await AdminService.getArticles("chronicle");
        else this.articles = await AdminService.getArticles("all");
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
          break;
        case "oldest":
          this.filteredArticles.sort((a, b) =>
            a.timestamp > b.timestamp ? 1 : -1
          );
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
    async toggleVisibility(articleID) {
      try {
        await AdminService.toggleVisibility(articleID);

        this.getArticles();
        this.$emit("notify", {
          type: "success",
          message: "Vidnost članka je bila spremenjena",
        });
      } catch (error) {
        this.error = error.message;
      }
    },
    deleteArticleConfirm(articleID) {
      this.deleteID = articleID;
      this.alert = true;
    },
    alertOK() {
      this.alert = false;

      this.deleteArticle(this.deleteID);
    },
    alertCancel() {
      this.alert = false;
      this.deleteID = "";
    },
    async deleteArticle(articleID) {
      try {
        await AdminService.deleteArticle(articleID);

        this.getArticles();
        this.$emit("notify", {
          type: "success",
          message: "Članek je bil izbrisan",
        });
      } catch (error) {
        this.error = error.message;
      }
    },
  },
  beforeMount() {
    if (!this.isAdmin) {
      router.push("/login");
    }

    this.getArticles();
  },
};
</script>

<style scoped>
table {
  @apply my-5 rounded-t-md;
}

th {
  @apply bg-green-500 border border-gray-300 text-white font-semibold text-lg p-2;
}

td {
  @apply p-2 border border-gray-300;
}

tr:nth-child(even) {
  @apply bg-gray-100;
}

.source {
  width: 10%;
}

.title {
  width: 60%;
}

.datetime {
  width: 15%;
}

.actions {
  width: 15%;
}

.actions-container {
  @apply flex justify-center flex-row;
}

td span {
  @apply mx-2 relative cursor-pointer;
}

.tooltip {
  @apply absolute bg-white border border-gray-400 rounded-md py-1 px-2 shadow-md font-semibold;
  top: -40px;
  left: -50%;
  display: none;
}

td span:hover .tooltip {
  display: block;
}
</style>
