<template>
  <div
    class="grid md:grid-cols-3 sm:grid-cols-2 gap-4 grid-flow-row place-content-center"
  >
    <div
      class="card"
      v-for="(article, index) in articles"
      :item="article"
      :index="index"
      :key="article.id"
    >
      <div class="card-header w-full">
        <img class="card-image" :src="article.image" />
        <div class="card-source">{{ article.source }}</div>
      </div>
      <div class="card-body">
        <h2 class="card-title">{{ article.title }}</h2>
        <p class="card-description">
          {{
            article.summary.substring(
              0,
              120 + article.summary.substring(119).indexOf(" ")
            ) + "..."
          }}
        </p>
      </div>
      <router-link :to="'/article/' + article._id">
        <div class="card-overview">
          <span class="overview-text">Preberi več</span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import ArticlesService from "../articlesService";

export default {
  name: "ArticlesList",
  data() {
    return {
      articles: [],
      error: "",
    };
  },
  methods: {
    async getArticles() {
      try {
        this.articles = await ArticlesService.getAllArticles();
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card {
  @apply w-full max-w-sm inline border border-gray-400 relative bg-gray-50 shadow-xl;
}

.card-body {
  @apply p-1;
}

.card-image {
  width: 100%;
  @apply object-cover max-h-36;
}

.card-source {
  @apply absolute top-0 left-0 inline w-auto p-1 px-2 bg-green-600 text-white;
}

.card-title {
  @apply text-lg leading-5 border-b border-gray-400 py-1;
}

.card-description {
  @apply text-sm text-gray-600;
}

.card-overview {
  background-color: rgba(0, 0, 0, 0);
  color: rgba(0, 0, 0, 0);
  @apply absolute h-full w-full top-0 transition-all duration-300 cursor-pointer text-center;
}
.card-overview:hover {
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
}

.overview-text {
  @apply absolute top-1/2 font-bold text-xl;
  transform: translate(-50%, -50%);
}
</style>
