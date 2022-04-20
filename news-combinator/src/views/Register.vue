<template>
  <div
    class="form max-w-lg border-2 border-green-500 mx-auto shadow-lg rounded-md"
  >
    <div class="bg-green-500 p-5 rounded-t-sm">
      <h1 class="text-3xl font-semibold text-center text-gray-50">
        Registracija
      </h1>
    </div>
    <div class="p-10 pt-3">
      <div class="form-control">
        <label for="email">E-Pošta</label>
        <div class="input-container" :class="{ borderRed: emailError }">
          <span class="icon-container" :class="{ backgroundRed: emailError }">
            <i class="far fa-envelope"></i>
          </span>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="primer@mail.com"
            @input="authenticateEmail"
          />
        </div>
        <p class="error">{{ emailError }}</p>
      </div>
      <div class="form-control">
        <label for="username">Uporabniško Ime</label>
        <div class="input-container" :class="{ borderRed: usernameError }">
          <span
            class="icon-container"
            :class="{ backgroundRed: usernameError }"
          >
            <i class="fas fa-user"></i>
          </span>
          <input
            type="text"
            id="username"
            v-model="username"
            placeholder="Vpišite vaše uporabniško ime"
            @input="authenticateUsername"
          />
        </div>
        <p class="error">{{ usernameError }}</p>
      </div>
      <div class="form-control">
        <label for="password">Geslo</label>
        <div class="input-container" :class="{ borderRed: passwordError }">
          <span
            class="icon-container"
            :class="{ backgroundRed: passwordError }"
          >
            <i class="fas fa-lock"></i>
          </span>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Vpišite geslo za vpis"
            @input="authenticatePassword"
          />
        </div>
        <p class="error" v-if="passwordError">{{ passwordError }}</p>
      </div>
      <div class="form-control">
        <label for="password-repeat">Ponovitev gesla</label>
        <div
          class="input-container"
          :class="{ borderRed: passwordRepeatError }"
        >
          <span
            class="icon-container"
            :class="{ backgroundRed: passwordRepeatError }"
          >
            <i class="fas fa-key"></i>
          </span>
          <input
            type="password"
            id="password-repeat"
            v-model="passwordRepeat"
            placeholder="Potrdite geslo za vpis"
            @input="authenticatePasswordRepeat"
          />
        </div>
        <p class="error">
          {{ passwordRepeatError }}
        </p>
      </div>
      <div class="form-control text-center">
        <p class="error font-semibold">{{ error }}</p>
        <button
          class="p-3 mt-6 text-white rounded-sm bg-green-500 hover:bg-green-400 text-xl transition duration-200"
          :class="{ backgroundRed: formInvalid }"
          @click="insertUser"
        >
          Registriraj račun
        </button>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import userService from "../userService";
import router from "../router";

export default {
  name: "Register",
  components: {},
  emits: ["notify"],
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
      formInvalid: false,
      registerTries: 0,
      error: "",
    };
  },
  methods: {
    authenticateEmail() {
      if (
        // eslint-disable-next-line
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/.test(
          this.email
        ) == false &&
        this.email != ""
      ) {
        this.emailError = "E-Pošta mora biti v pravilnem formatu";
      } else {
        this.emailError = "";
      }
      this.authenticateForm();
    },

    authenticateUsername() {
      if (
        /^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/.test(this.username) ==
          false &&
        this.username != ""
      ) {
        this.usernameError =
          "Uporabniško ime lahko vsebuje samo črke in številke";
      } else {
        this.usernameError = "";
      }
      this.authenticateForm();
    },

    authenticatePassword() {
      if (this.password.length < 5 && this.password != "") {
        this.passwordError = "Geslo ime mora vsebovati vsaj 5 znakov";
      } else {
        this.passwordError = "";
      }
      this.authenticateForm();
    },

    authenticatePasswordRepeat() {
      if (this.password != this.passwordRepeat) {
        this.passwordRepeatError = "Gesla se ne ujemata";
      } else {
        this.passwordRepeatError = "";
      }
      this.authenticateForm();
    },

    authenticateForm() {
      if (this.registerTries >= 1) {
        if (
          this.email != "" &&
          this.username != "" &&
          this.password != "" &&
          this.passwordRepeat != "" &&
          this.emailError === "" &&
          this.usernameError === "" &&
          this.passwordError === "" &&
          this.passwordRepeatError === ""
        ) {
          this.formInvalid = false;
        } else {
          this.formInvalid = true;
        }
      }
    },

    async insertUser() {
      this.registerTries++;
      this.authenticateForm();
      if (this.formInvalid === false) {
        try {
          const response = await userService.insertUser(
            this.email,
            this.username,
            this.password
          );
          if (response.status === 201) {
            router.push("/login");
            this.$emit("notify", {
              type: "success",
              message: "Račun uspešno registriran",
            });
          } else {
            this.error = response;
            setTimeout(() => {
              this.error = "";
            }, 5000);
            this.$emit("notify", {
              type: "error",
              message: response,
            });
          }
        } catch (error) {
          this.error = error.message;
        }
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
  @apply my-1 border-2 border-green-500 rounded-sm w-full flex;
}

.icon-container {
  @apply p-2 px-3 text-lg text-white bg-green-500;
}

input {
  @apply focus:outline-none p-2 text-lg w-full;
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
