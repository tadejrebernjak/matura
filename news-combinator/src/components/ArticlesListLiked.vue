<template>
  <NewsCardWide
    v-for="(article, index) in articles"
    :item="article"
    :index="index"
    :key="article.id"
    :article="article"
    :type="'liked'"
  />
</template>

<script>
import NewsCardWide from "@/components/NewsCardWide.vue";

export default {
  name: "ArticlesListLiked",
  components: {
    NewsCardWide,
  },
  props: {
    articles: Array,
  },
};
</script>
