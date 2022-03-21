<template>
  <div class="card">
    <div class="card-header w-full">
      <span v-if="article.image == 'https://siol.netundefined'">
        <img class="card-image" :src="noImage" />
      </span>
      <span v-else>
        <img class="card-image" :src="article.image" />
      </span>
      <div class="card-source" :class="article.source">
        {{ article.source }}
      </div>
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
</template>

<script>
const noImage = require("@/assets/image_not_available.png");

export default {
  name: "NewsCardThin",
  props: {
    article: Object,
  },
  data() {
    return {
      noImage: noImage,
    };
  },
};
</script>

<style scoped>
.card {
  @apply w-full max-w-sm inline border border-gray-400 relative bg-gray-50 shadow-md;
}

.card-body {
  @apply p-2;
}

.card-image {
  width: 100%;
  @apply object-cover max-h-36;
}

.card-source {
  @apply absolute top-0 left-0 inline w-auto p-1 px-2 bg-green-500 font-semibold text-white;
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
