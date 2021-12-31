<template>
  <div
    class="form max-w-md mx-auto mt-10 p-10 border bg-gray-50 border-gray-400 shadow-lg rounded-md"
  >
    <div class="form-control">
      <label for="email">E-Pošta</label>
      <input
        :class="{ inputError: emailError }"
        type="email"
        id="email"
        v-model="email"
        placeholder="primer@mail.com"
        v-on:input="authenticateEmail"
      />
      <p class="error">{{ emailError }}</p>
    </div>
    <div class="form-control">
      <label for="username">Uporabniško Ime</label>
      <input
        :class="{ inputError: usernameError }"
        type="text"
        id="username"
        v-model="username"
        v-on:input="authenticateUsername"
      />
      <p class="error">{{ usernameError }}</p>
    </div>
    <div class="form-control">
      <label for="password">Geslo</label>
      <input
        :class="{ inputError: passwordError }"
        type="password"
        id="password"
        v-model="password"
        v-on:input="authenticatePassword"
      />
      <p class="error" v-if="passwordError">{{ passwordError }}</p>
    </div>
    <div class="form-control">
      <label for="password-repeat">Ponovitev gesla</label>
      <input
        :class="{ inputError: passwordRepeatError }"
        type="password"
        id="password-repeat"
        v-model="passwordRepeat"
        v-on:input="authenticatePasswordRepeat"
      />
      <p class="error">
        {{ passwordRepeatError }}
      </p>
    </div>
    <div class="form-control text-center">
      <p class="error">{{ error }}</p>
      <button
        class="p-2 mx-2 w-36 rounded-sm bg-green-400 hover:bg-green-500 text-lg hover:text-white transition duration-300"
        v-on:click="authenticateForm"
      >
        Registriraj
      </button>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
/*import userService from "../userService";
import router from "../router";*/

export default {
  name: "Register",
  components: {},
  data() {
    return {
      email: "",
      username: "",
      password: "",
      passwordRepeat: "",
      emailError: "",
      usernameError: "",
      passwordError: "",
      passwordRepeatError: "",
      error: "",
    };
  },
  methods: {
    authenticateEmail() {
      if (
        // eslint-disable-next-line
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/.test(
          this.email
        ) == false
      ) {
        this.emailError = "Prosim vpišite pravilno E-Pošto";
      } else {
        this.emailError = "";
      }
    },

    authenticateUsername() {
      if (/^[A-Za-z0-9]+$/.test(this.username) == false) {
        this.usernameError =
          "Uporabniško ime lahko vsebuje samo črke in številke";
      } else {
        this.usernameError = "";
      }
    },

    authenticatePassword() {
      if (this.password.length < 5) {
        this.passwordError = "Geslo ime mora vsebovati vsaj 5 znakov";
      } else {
        this.passwordError = "";
      }
    },

    authenticatePasswordRepeat() {
      if (this.password != this.passwordRepeat) {
        this.passwordRepeatError = "Gesla se ne ujemata";
      } else {
        this.passwordRepeatError = "";
      }
    },

    /*async insertUser() {
      try {
        await userService.insertUser(this.email, this.username, this.password);
        router.push("/login");
      } catch (error) {
        this.error = error.message;
      }
    },*/
  },
};
</script>

<style scoped>
label {
  display: block;
}

input {
  width: 100%;
  @apply my-1 p-2 border border-gray-300;
}

.form-control {
  @apply my-4;
}

.error {
  @apply text-red-600 text-sm;
}

.inputError {
  @apply border-red-500 focus:border-red-500;
}
</style>
