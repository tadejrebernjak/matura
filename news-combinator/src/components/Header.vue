<template>
  <header class="bg-gray-50 border-b border-gray-400">
    <div
      class="container max-w-4xl mx-auto p-6 flex flex-row justify-between flex-wrap items-baseline"
    >
      <div class="menu-icon" @click="$emit('openMenu')">
        <i class="fas fa-bars"></i>
      </div>
      <div class="main-links">
        <router-link to="/">
          <span class="text-4xl">Novice</span>
        </router-link>
        <router-link to="/news/sport" class="ml-4">
          <span class="text-xl uppercase">Šport</span>
        </router-link>
        <router-link to="/news/chronicle" class="ml-2">
          <span class="text-xl uppercase">Kronika</span>
        </router-link>
        <router-link to="/today" class="ml-2">
          <span class="text-xl uppercase">Danes</span>
        </router-link>
      </div>
      <div class="flex content-center">
        <template v-if="!authenticated">
          <router-link to="/login">
            <button class="account-link">
              <i class="fas fa-sign-in-alt"></i> Prijava
            </button>
          </router-link>
          <router-link to="/register">
            <button class="account-btn">
              <i class="fas fa-user-plus"></i> Registracija
            </button>
          </router-link>
        </template>

        <template v-else>
          <router-link to="/dashboard">
            <button class="account-link">
              <i class="fas fa-user"></i> {{ user.username }}
            </button>
          </router-link>
          <button class="account-btn" @click="logout">
            <i class="fas fa-sign-out-alt"></i> Odjava
          </button>
        </template>
      </div>
    </div>
  </header>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import router from "../router";

export default {
  name: "Header",
  computed: {
    ...mapGetters({
      authenticated: "auth/authenticated",
      user: "auth/user",
    }),
  },
  emits: ["openMenu"],
  methods: {
    ...mapActions({
      logoutAction: "auth/logout",
    }),

    logout() {
      router.push("/");
      this.logoutAction();
    },
  },
};
</script>

<style scoped>
.account-btn {
  @apply p-3 mx-2 rounded-lg bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-lg text-white transition duration-300;
}

.account-link {
  @apply p-3 mx-2 text-green-500 hover:text-green-600 transition-all text-xl font-semibold;
}

.main-links {
  @apply flex-row flex-wrap items-center;
  display: flex;
}

.menu-icon {
  @apply text-3xl hover:text-gray-600 transition-all duration-100 cursor-pointer;
  display: none;
}

@media only screen and (max-width: 750px) {
  .main-links {
    display: none;
  }
  .menu-icon {
    display: block;
  }
}
</style>
