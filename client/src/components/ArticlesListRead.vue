<template>
  <NewsCardWide
    v-for="(article, index) in articles"
    :item="article"
    :index="index"
    :key="article.id"
    :article="article"
    :type="'read'"
  />
</template>

<script>
import NewsCardWide from "@/components/NewsCardWide.vue";

export default {
  name: "ArticlesListRead",
  components: {
    NewsCardWide,
  },
  props: {
    articles: Array,
  },
};
</script>
