<template>
  <Header />
  <div class="container max-w-4xl mx-auto p-2 my-8">
    <router-view />
  </div>
  <Footer />
</template>

<script>
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default {
  components: {
    Header,
    Footer,
  },
};
</script>

<style>
#app {
  padding-bottom: 125px;
  @apply min-h-screen relative;
}
</style>
