<template>
  <h1 class="text-3xl text-center">
    <router-link to="/">Domov</router-link>
    <span v-if="authenticated">
      > <router-link to="/dashboard">Nadzorna Plošča</router-link></span
    >
    > <span class="text-green-600">Urejanje profila</span>
  </h1>
  <div
    class="my-10 border border-gray-400 rounded-md shadow-md flex flex-wrap sm:flex-nowrap overflow-hidden"
  >
    <div class="w-full mb-7">
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
        <label for="password">Ponovitev gesla</label>
        <div class="input-container" :class="{ borderRed: passwordError }">
          <span
            class="icon-container"
            :class="{ backgroundRed: passwordError }"
          >
            <i class="fas fa-key"></i>
          </span>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Potrdite spremembe z geslom"
            @input="authenticatePassword"
          />
        </div>
        <p class="error">
          {{ passwordError }}
        </p>
      </div>
      <div class="form-control">
        <p class="error">
          {{ error }}
        </p>
        <button
          class="p-3 mt-6 mr-6 text-white rounded-sm bg-green-500 hover:bg-green-400 text-xl transition duration-200"
          :class="{ backgroundRed: formInvalid }"
          @click="updateUser"
        >
          Shrani spremembe
        </button>
        <router-link to="/dashboard">
          <button
            class="p-3 mt-6 text-white rounded-sm bg-green-500 hover:bg-green-400 text-xl transition duration-200"
          >
            Nazaj
          </button>
        </router-link>
      </div>
      <p class="saved-notice" v-if="saved">Spremembe so bile shranjene</p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import userService from "../userService";

export default {
  name: "Dashboard",
  components: {},
  data() {
    return {
      username: "",
      email: "",
      password: "",
      emailError: "",
      usernameError: "",
      passwordError: "",
      formInvalid: true,
      error: "",
      saved: false,
    };
  },
  emits: ["notify"],
  computed: {
    ...mapGetters({
      authenticated: "auth/authenticated",
      user: "auth/user",
    }),
  },
  created() {
    this.loadInfo();
  },
  methods: {
    ...mapActions({
      saveToken: "auth/saveToken",
    }),

    loadInfo() {
      this.$nextTick(function () {
        this.username = this.user.username;
        this.email = this.user.email;
      });
    },

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

    authenticateForm() {
      if (
        this.email != "" &&
        this.username != "" &&
        this.password != "" &&
        this.emailError === "" &&
        this.usernameError === "" &&
        this.passwordError === ""
      ) {
        this.formInvalid = false;
      } else {
        this.formInvalid = true;
      }
    },
    async updateUser() {
      if (this.formInvalid === false) {
        try {
          const response = await userService.updateUser(
            this.email,
            this.username,
            this.password
          );
          if (response.status !== 200) {
            this.$emit("notify", {
              type: "error",
              message: response.data,
            });
          } else {
            await this.saveToken(response.data.accessToken);
            this.password = "";
            this.error = "";
            this.$emit("notify", {
              type: "success",
              message: "Profil je bil posodobljen",
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
  @apply my-1 border border-gray-400 rounded-sm w-full flex;
}

.icon-container {
  @apply p-2 px-3 text-xl text-white bg-gray-400;
}

input {
  @apply focus:outline-none p-2 text-lg w-full;
}

.form-control {
  @apply mx-auto my-4 w-4/5;
}

.error {
  @apply text-red-600 mt-2 font-semibold;
}

.backgroundRed {
  @apply bg-red-500 hover:bg-red-500;
}

.borderRed {
  @apply border-red-500 focus:border-red-500;
}

.saved-notice {
  @apply text-center text-green-400 font-semibold text-lg opacity-0;
  animation: 5s linear savedNotice;
}

@keyframes savedNotice {
  0% {
    transform: translateY(10px);
    opacity: 0;
  }
  10% {
    transform: translate(0, 0);
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
