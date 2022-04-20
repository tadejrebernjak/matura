<template>
  <h1 class="text-3xl border-b border-gray-600 pb-4 mb-10">
    <router-link to="/admin">Admin</router-link>
    > <span class="text-green-600">Posodabljanje novic</span>
  </h1>
  <div class="flex flex-row justify-between">
    <button @click="updateArticles('all')">Vse</button>
    <button @click="updateArticles('24ur')">24ur</button>
    <button @click="updateArticles('siol')">Siol</button>
    <button @click="updateArticles('delo')">Delo</button>
  </div>
  <div class="flex justify-center mt-10" v-if="loading">
    <img :src="loadingGif" alt="loading..." />
  </div>
  <table class="table-fixed" v-if="newArticles && !loading">
    <tr class="rounded-t-md">
      <th class="source">Source</th>
      <th class="title">Title</th>
      <th class="datetime">Date & Time</th>
    </tr>
    <tr
      v-for="(article, index) in newArticles"
      :item="article"
      :index="index"
      :key="article._id"
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
    </tr>
  </table>
</template>

<script>
import { mapGetters } from "vuex";
import AdminService from "../adminService";
import router from "../router";
const loadingGif = require("../assets/loading.gif");

export default {
  name: "AdminArticlesUpdate",
  components: {},
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
      newArticles: null,
      loading: false,
      loadingGif: loadingGif,
      error: "",
    };
  },
  methods: {
    async updateArticles(type) {
      if (this.loading) {
        return;
      }

      this.loading = true;
      try {
        this.newArticles = await AdminService.updateArticles(type);
        this.$emit("notify", {
          type: "success",
          message: "Članki so bili dodani",
        });
      } catch (error) {
        this.error = error.message;
      }
      this.loading = false;
    },
  },
  beforeMount() {
    if (!this.isAdmin) {
      router.push("/login");
    }
  },
};
</script>

<style scoped>
button {
  @apply p-3 w-40 text-center font-semibold text-2xl text-green-100 hover:text-white bg-gradient-to-r from-green-400 to-green-500 border-2 border-green-600 rounded-md shadow-lg cursor-pointer transition-all duration-300;
}

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
