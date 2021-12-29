<template>
  <Header />
  <div class="container max-w-4xl mx-auto p-2">
    <router-view />
  </div>
</template>

<script>
import Header from "@/components/Header";

export default {
  components: {
    Header,
  },
};
</script>

<style></style>
