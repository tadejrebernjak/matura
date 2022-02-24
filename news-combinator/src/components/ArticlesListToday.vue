<template>
  <div
    class="card"
    v-for="(article, index) in articles"
    :item="article"
    :index="index"
    :key="article.id"
  >
    <div class="card-image">
      <div class="card-source">{{ article.source }}</div>
      <router-link :to="'/article/' + article._id">
        <img class="card-image" :src="article.image" />
      </router-link>
    </div>
    <div class="card-content">
      <router-link :to="'/article/' + article._id">
        <h2 class="card-title">{{ article.title }}</h2>
      </router-link>
      <p class="card-description">
        {{
          article.summary.substring(
            0,
            200 + article.summary.substring(199).indexOf(" ")
          ) + "..."
        }}
      </p>
      <p class="mt-2 text-gray-800">
        {{ article.time }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "ArticlesListToday",
  props: {
    articles: Array,
  },
};
</script>

<style scoped>
.card {
  @apply w-full relative border border-gray-400 bg-gray-50 shadow-xl flex mb-4;
}

.card-image {
  @apply object-cover w-3/5 p-3 relative;
}

.card-image img {
  width: 100%;
}

.card-source {
  @apply absolute top-3 left-3 inline w-auto p-1 px-2 bg-green-600 text-white z-50 shadow-md;
}

.card-content {
  @apply w-full p-4;
}

.card-title {
  @apply text-xl leading-5 border-b border-gray-400 py-1 mb-2 font-semibold hover:underline;
}

.card-description {
  @apply text-gray-600;
}
</style>
