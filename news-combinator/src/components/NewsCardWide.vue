<template>
  <div class="card">
    <div class="card-image">
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
      <router-link :to="'/article/' + article._id">
        <span v-if="article.image == 'https://siol.netundefined'">
          <img class="card-image" :src="noImage" />
        </span>
        <span v-else>
          <img class="card-image" :src="article.image" />
        </span>
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
            150 + article.summary.substring(149).indexOf(" ")
          ) + "..."
        }}
      </p>
      <p v-if="type == 'read'" class="mt-2 text-gray-800">
        {{ "Prebral " + article.readAgo }}
      </p>
      <p v-if="type == 'liked'" class="mt-2 text-gray-800">
        {{ "Všečkal " + article.likedAgo }}
      </p>
    </div>
    <p v-if="type == 'today'" class="mt-5 absolute bottom-4 right-2 text-right">
      <span class="p-2 rounded-md bg-green-500 text-white font-semibold">{{
        article.time
      }}</span>
    </p>
  </div>
</template>

<script>
const noImage = require("@/assets/image_not_available.png");

export default {
  name: "NewsCardWide",
  props: {
    article: Object,
    type: String,
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
  min-height: 204px;
  @apply w-full relative border border-gray-400 bg-gray-50 shadow-md flex mb-4;
}

.card-image {
  @apply object-cover w-3/5 p-3 relative;
}

.card-image img {
  width: 100%;
  max-height: 180px;
}

.card-source {
  @apply absolute top-3 left-3 inline w-auto p-1 px-2 bg-green-600 text-white z-50 shadow-md font-bold uppercase;
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

.card-content {
  @apply w-full p-4 pb-6;
}

.card-title {
  @apply text-xl leading-5 border-b border-gray-400 py-1 mb-2 font-semibold hover:underline;
}

.card-description {
  @apply text-gray-600;
}
</style>
