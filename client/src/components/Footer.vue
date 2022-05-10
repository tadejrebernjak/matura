<template>
  <footer>
    <div>
      <h1 class="text-center font-semibold text-2xl text-white">Viri</h1>
      <ul>
        <li><a href="https://www.24ur.com/">24ur</a></li>
        <li><a href="https://www.delo.si/">Delo</a></li>
        <li><a href="https://siol.net/">Siol</a></li>
        <li><a href="https://www.slovenskenovice.si/">Slovenske Novice</a></li>
      </ul>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<style scoped>
footer {
  min-height: 125px;
  @apply absolute w-full bottom-0 bg-green-500 border-t-2 border-green-600 flex items-center justify-center;
}

ul {
  @apply flex flex-wrap flex-row justify-center;
}

li {
  @apply inline mx-2 text-gray-100 text-lg hover:underline;
}
</style>
