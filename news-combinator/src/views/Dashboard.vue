<template>
  <h1 class="font-semibold text-2xl border-b-2 border-gray-600 pb-4">
    Pozdravljen/a, <span class="text-green-500">{{ user.username }}!</span>
  </h1>

  <div class="action-list">
    <div class="action-card">
      <i class="fas fa-user-circle"></i>
      <h2>Urejanje profila</h2>
    </div>

    <div class="action-card">
      <i class="fas fa-comments"></i>
      <h2>Vaši komentarji</h2>
    </div>

    <div class="action-card">
      <i class="fas fa-clock"></i>
      <h2>Nedavno prebrano</h2>
    </div>

    <div class="action-card">
      <i class="fas fa-thumbs-up"></i>
      <h2>Všečkane novice</h2>
    </div>

    <div class="action-card">
      <i class="fas fa-calendar-day"></i>
      <h2>Novice dneva</h2>
    </div>

    <div class="action-card">
      <i class="far fa-newspaper"></i>
      <h2>Seznam novic</h2>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Dashboard",
  components: {},
  computed: {
    ...mapGetters({
      authenticated: "auth/authenticated",
      user: "auth/user",
    }),
  },
  data() {
    return {};
  },
};
</script>

<style scoped>
.action-list {
  @apply mt-10 grid md:grid-cols-3 sm:grid-cols-2 gap-10;
}

.action-card {
  @apply p-5 py-10 md:max-w-xs sm:max-w-lg text-center font-semibold text-2xl text-white hover:text-gray-200 bg-gradient-to-r from-green-400 to-green-500 border-2 border-green-600 rounded-md shadow-lg cursor-pointer transition-all duration-300;
}

.action-card:hover {
  transform: translate(-5px, -10px);
}

.action-card i {
  @apply text-6xl mb-2;
}
</style>
