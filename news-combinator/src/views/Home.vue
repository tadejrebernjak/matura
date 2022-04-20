<template>
  <ArticlesList />
</template>

<script>
// @ is an alias to /src
import ArticlesList from "@/components/ArticlesList";

export default {
  name: "Home",
  components: {
    ArticlesList,
  },
  emits: ["notify"],
};
</script>
