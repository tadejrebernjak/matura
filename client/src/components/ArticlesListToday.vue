<template>
  <NewsCardWide
    v-for="article in articles"
    :item="article"
    :key="article.id"
    :article="article"
    :type="'today'"
  />
</template>

<script>
import NewsCardWide from "@/components/NewsCardWide.vue";

export default {
  name: "ArticlesListToday",
  components: {
    NewsCardWide,
  },
  props: {
    articles: Array,
  },
};
</script>
