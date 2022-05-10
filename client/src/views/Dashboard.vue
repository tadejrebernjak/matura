<template>
  <h1 class="text-3xl border-b border-gray-600 pb-4">
    Pozdravljen/a, <span class="text-green-500">{{ user.username }}!</span>
  </h1>

  <div class="action-list">
    <router-link to="/profile">
      <div class="action-card">
        <i class="fas fa-user-circle"></i>
        <h2>Urejanje profila</h2>
      </div>
    </router-link>

    <router-link to="/read">
      <div class="action-card">
        <i class="fas fa-clock"></i>
        <h2>Nedavno prebrano</h2>
      </div>
    </router-link>

    <router-link to="/liked">
      <div class="action-card">
        <i class="fas fa-thumbs-up"></i>
        <h2>Všečkane novice</h2>
      </div>
    </router-link>

    <router-link to="/today">
      <div class="action-card">
        <i class="fas fa-calendar-day"></i>
        <h2>Novice dneva</h2>
      </div>
    </router-link>

    <router-link to="/">
      <div class="action-card">
        <i class="far fa-newspaper"></i>
        <h2>Seznam novic</h2>
      </div>
    </router-link>

    <router-link to="/admin" v-if="isAdmin">
      <div class="admin-card">
        <i class="fas fa-unlock-alt"></i>
        <h2>Admin panel</h2>
      </div>
    </router-link>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Dashboard",
  components: {},
  emits: ["notify"],
  computed: {
    ...mapGetters({
      authenticated: "auth/authenticated",
      user: "auth/user",
      isAdmin: "auth/isAdmin",
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
  @apply p-5 py-10 md:max-w-xs sm:max-w-lg text-center font-semibold text-2xl text-green-100 hover:text-white bg-gradient-to-r from-green-400 to-green-500 border-2 border-green-600 rounded-md shadow-lg cursor-pointer transition-all duration-300;
}

.admin-card {
  @apply p-5 py-10 md:max-w-xs sm:max-w-lg text-center font-semibold text-2xl text-blue-100 hover:text-white bg-gradient-to-r from-blue-400 to-blue-500 border-2 border-blue-600 rounded-md shadow-lg cursor-pointer transition-all duration-300;
}

.action-card:hover,
.admin-card:hover {
  transform: translate(-5px, -10px);
}

.action-card i,
.admin-card i {
  @apply text-6xl mb-2;
}
</style>
