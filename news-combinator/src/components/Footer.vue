<template>
  <footer>
    <h1 class="text-center font-semibold text-4xl text-white">Footer</h1>
  </footer>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<style scoped>
footer {
  height: 125px;
  @apply absolute w-full bottom-0 bg-green-500 border-t-2 border-green-600 flex items-center justify-center;
}
</style>
