<template>
  <div class="article-preview">
    <div class="mt-5">
      <div class="tag">{{ article.source }}</div>
      <div class="tag">{{ article.category }}</div>
    </div>
    <h1 class="text-3xl py-2 mt-2 font-bold text-white">
      {{ article.title }}
    </h1>
    <p class="text-lg border-b border-gray-100 text-gray-100 pb-2">
      {{ article.date }} • {{ article.time }}
    </p>
    <p class="text-lg text-gray-50 py-2">{{ article.summary }}</p>
    <div class="actions">
      <div class="grid items-center">
        <a class="visit-btn" :href="article.url" target="_blank"
          >Obišči članek</a
        >
      </div>
      <div class="details">
        <div class="visits">
          <i class="far fa-hand-pointer details-icon"></i>
          <p class="detail-value">{{ counters.clicks }}</p>
        </div>
        <div class="comments">
          <i class="far fa-comment details-icon"></i>
          <p class="detail-value">{{ counters.comments }}</p>
        </div>
        <div class="likes" :class="rating" @click="$emit('like')">
          <i class="far fa-thumbs-up details-icon"></i>
          <p class="detail-value">{{ counters.likes }}</p>
        </div>
        <div class="dislikes" :class="rating" @click="$emit('dislike')">
          <i class="far fa-thumbs-down details-icon"></i>
          <p class="detail-value">{{ counters.dislikes }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ArticlePreview",
  components: {},
  props: ["article", "counters", "rating", "articleImg"],
  methods: {},
};
</script>

<style scoped>
.tag {
  @apply inline mr-3 p-1 text-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white uppercase rounded-md;
}

.article-preview::before {
  content: "";
  z-index: -1;
  background-image: v-bind(articleImg);
  @apply absolute top-0 left-0 h-full w-full bg-no-repeat bg-center bg-cover rounded-lg;
}

.article-preview {
  background-color: rgba(0, 0, 0, 0.6);
  @apply p-7 relative rounded-lg shadow-2xl;
}

.actions {
  @apply my-5 mt-10 flex justify-between content-center flex-row flex-wrap;
}

.visit-btn {
  @apply text-white text-xl bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 opacity-95 hover:opacity-100 p-3 rounded-sm;
}

.details {
  @apply grid items-center place-content-center
   grid-cols-4 gap-5 mt-7;
}

@media screen and (max-width: 300px) {
  .details {
    @apply grid-cols-2;
  }
}

.details > div {
  @apply inline text-center mb-1 text-white text-opacity-75 hover:text-gray-300 cursor-pointer transition-all duration-200;
}

.details-icon {
  @apply text-4xl block;
}

.detail-value {
  @apply mt-1 font-bold text-lg;
}

.likes.liked {
  @apply text-lime-400 hover:text-lime-500;
}

.dislikes.disliked {
  @apply text-red-500 hover:text-red-600;
}
</style>
