<template>
  <div
    class="form max-w-lg border-2 border-green-500 mx-auto mt-10 shadow-lg rounded-md"
  >
    <div class="bg-green-500 p-5 rounded-t-sm">
      <h1 class="text-3xl font-semibold text-center text-gray-50">Vpis</h1>
    </div>
    <div class="p-10 pt-3">
      <div class="form-control">
        <label for="email">E-Pošta</label>
        <div class="input-container" :class="{ borderRed: loginError }">
          <span class="icon-container" :class="{ backgroundRed: loginError }">
            <i class="far fa-envelope"></i>
          </span>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="primer@mail.com"
          />
        </div>
      </div>
      <div class="form-control">
        <label for="password">Geslo</label>
        <div class="input-container" :class="{ borderRed: loginError }">
          <span class="icon-container" :class="{ backgroundRed: loginError }">
            <i class="fas fa-lock"></i>
          </span>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Vpišite geslo za vpis"
          />
        </div>
      </div>
      <div class="form-control text-center">
        <p class="error">{{ loginError }}</p>
        <p>{{ loginResponse }}</p>
        <button
          class="p-3 mt-6 text-white rounded-sm bg-green-500 hover:bg-green-400 text-xl transition duration-200"
          @click="loginCheck"
        >
          Prijavi se
        </button>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import userService from "../userService";
//import router from "../router";

export default {
  name: "Login",
  components: {},
  data() {
    return {
      email: "",
      password: "",
      loginError: "",
      loginResponse: "",
    };
  },
  methods: {
    async loginCheck() {
      if (this.email != "" && this.password != "") {
        this.loginResponse = await userService.authenticateUser(
          this.email,
          this.password
        );
      }
    },
  },
};
</script>

<style scoped>
label {
  display: block;
  @apply text-lg font-semibold mb-2;
}

.input-container {
  @apply my-1 border-2 border-green-500 rounded-sm w-full;
}

.icon-container {
  width: 10%;
  @apply p-3 text-lg text-white bg-green-500 rounded-l-sm;
}

input {
  width: 90%;
  @apply focus:outline-none p-2 text-lg;
}

.form-control {
  @apply my-4;
}

.error {
  @apply text-red-600 mt-2;
}

.backgroundRed {
  @apply bg-red-500 hover:bg-red-500;
}

.borderRed {
  @apply border-red-500 focus:border-red-500;
}
</style>
