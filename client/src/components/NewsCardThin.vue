<template>
  <router-link class="card" :to="'/article/' + article._id">
    <div class="card-header">
      <img v-if="article.image == null" class="card-image" :src="noImage" />
      <img v-else class="card-image" :src="article.image" />
      <div
        class="card-source"
        :class="{
          stiriindvajsetur: article.source === '24ur',
          delo: article.source === 'Delo',
          slovenskenovice: article.source === 'Slovenske Novice',
          siol: article.source === 'Siol',
        }"
      >
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
    <div class="card-foot">
      <div class="visits">
        <i class="far fa-hand-pointer details-icon"></i>
        <p>{{ article.clicks.length }}</p>
      </div>
      <div class="comments">
        <a href="#commentsFeed">
          <i class="far fa-comment details-icon"></i>
          <p>{{ article.comments.length }}</p>
        </a>
      </div>
      <div class="likes">
        <i class="far fa-thumbs-up details-icon"></i>
        <p>{{ article.likes.length }}</p>
      </div>
      <div class="dislikes">
        <i class="far fa-thumbs-down details-icon"></i>
        <p>{{ article.dislikes.length }}</p>
      </div>
    </div>
  </router-link>
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
  @apply w-full pb-10 max-w-sm inline border border-gray-400 relative bg-gray-50 hover:bg-gray-200 shadow-md transition-all duration-150;
}

.card:hover .card-image {
  filter: brightness(90%);
}

.card-body {
  @apply p-2;
}

.card-image {
  @apply w-full object-cover max-h-36 transition-all duration-150;
}

.card-source {
  @apply absolute top-0 left-0 w-auto p-1 px-2 bg-green-500 font-bold text-white uppercase;
}

.stiriindvajsetur {
  background-color: #404faf;
}

.siol {
  background-color: #424193;
}

.slovenskenovice {
  background-color: #c60000;
}

.delo {
  background-color: #fff;
  color: #1f5ab1;
}

.card-title {
  @apply text-lg leading-5 border-b border-gray-400 py-1;
}

.card-description {
  @apply text-sm text-gray-600;
}

.card:hover .card-foot {
  @apply bg-gray-300;
}

.card-foot {
  @apply absolute flex flex-wrap justify-between bottom-0 w-full p-2 text-gray-600 font-semibold bg-gray-100 border-t border-gray-300 transition-all duration-150;
}

.card-foot div {
  @apply mx-3;
}

.card-foot div p {
  @apply inline ml-2;
}
</style>
