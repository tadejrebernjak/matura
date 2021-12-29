<template>
  <header class="bg-gray-100 border-b border-gray-400">
    <div
      class="container max-w-4xl mx-auto p-6 flex flex-row justify-between content-center"
    >
      <router-link to="/">
        <h1 class="text-4xl font-sans">Novice</h1>
      </router-link>
      <div class="flex content-center">
        <router-link to="login">
          <button class="account-btn">
            <i class="fas fa-sign-in-alt"></i> Prijava
          </button>
        </router-link>
        <router-link to="register">
          <button class="account-btn">
            <i class="fas fa-user"></i> Registracija
          </button>
        </router-link>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: "Header",
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.account-btn {
  @apply p-2 mx-2 w-36 rounded-sm bg-green-400 hover:bg-green-500 text-lg hover:text-white transition duration-300;
}
</style>
