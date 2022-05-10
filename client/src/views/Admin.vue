<template>
  <h1 class="text-3xl border-b border-gray-600 pb-4">Nadzorna plošča</h1>

  <div class="action-list">
    <router-link to="/admin/articles">
      <div class="action-card">
        <i class="far fa-newspaper"></i>
        <h2>Novice</h2>
      </div>
    </router-link>

    <router-link to="/admin/users">
      <div class="action-card">
        <i class="fas fa-users"></i>
        <h2>Uporabniki</h2>
      </div>
    </router-link>

    <router-link to="/admin/articles/update">
      <div class="action-card">
        <i class="fas fa-plus"></i>
        <h2>Posodobi novice</h2>
      </div>
    </router-link>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import router from "../router";

export default {
  name: "Admin",
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
  beforeMount() {
    if (!this.isAdmin) {
      router.push("/login");
    }
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
