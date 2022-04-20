<template>
  <h1 class="text-3xl text-center">
    <span> <router-link to="/admin">Admin</router-link></span>
    > <span> <router-link to="/admin/users">Uporabniki</router-link></span> >
    <span class="text-green-600">Urejanje uporabnika</span>
  </h1>
  <div
    class="my-10 border border-gray-400 rounded-md shadow-md flex flex-wrap overflow-hidden"
  >
    <div
      class="w-2/5 border-r border-gray-400 grid items-center justify-center p-4"
    >
      <img
        class="rounded-full object-cover w-64 h-64 border-2 border-gray-400"
        :src="editUser.pfp || defaultPfp"
        ref="pfpPreview"
        alt="Profilna slika"
      />
      <div class="mt-2 text-center">
        <button
          v-if="editUser.pfp"
          class="p-2 mt-2 inline m-auto text-white rounded-sm bg-green-500 hover:bg-green-400 text-xl transition duration-200 w-max cursor-pointer"
          @click="removePfp"
        >
          Odstrani
        </button>
      </div>
    </div>
    <div class="w-3/5">
      <div class="form-control">
        <span class="font-bold text-lg">ID: </span>
        <span class="cursor-pointer" @click="copyID(editUser._id)">{{
          editUser._id
        }}</span>
      </div>
      <div class="form-control">
        <label for="email">E-Pošta</label>
        <div class="input-container">
          <span class="icon-container">
            <i class="far fa-envelope"></i>
          </span>
          <input
            type="email"
            id="email"
            v-model="editUser.email"
            placeholder="primer@mail.com"
          />
        </div>
      </div>
      <div class="form-control">
        <label for="username">Uporabniško Ime</label>
        <div class="input-container">
          <span class="icon-container">
            <i class="fas fa-user"></i>
          </span>
          <input
            type="text"
            id="username"
            v-model="editUser.username"
            placeholder="Vpišite vaše uporabniško ime"
          />
        </div>
      </div>
      <div class="form-control">
        <p class="error">
          {{ error }}
        </p>
        <p>
          {{ notice }}
        </p>
        <button
          class="p-2 text-white rounded-sm bg-green-500 hover:bg-green-400 text-xl transition duration-200"
          @click="updateUser"
        >
          Shrani spremembe
        </button>
      </div>
      <hr class="border-gray-400" />
      <div class="form-control">
        <p
          v-if="editUser.muteExpiration"
          class="text-red-500 font-semibold text-lg"
        >
          {{ "Uporabnik je blokiran do " + mutedString }}
        </p>
        <label for="muteDays">Blokiraj uporabnika za:</label>
        <div class="input-container">
          <input type="number" id="muteDays" v-model="muteDays" />
          <span class="icon-container">dni</span>
        </div>
        <div class="flex justify-between">
          <button
            @click="muteUser"
            class="p-2 mt-3 text-white rounded-sm bg-green-500 hover:bg-green-400 text-xl transition duration-200"
          >
            Blokiraj
          </button>
          <button
            @click="unmuteUser"
            class="p-2 mt-3 text-white rounded-sm bg-green-500 hover:bg-green-400 text-xl transition duration-200"
          >
            Razveljavi
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import router from "../router";
import AdminService from "../adminService";
const defaultPfp = require("@/assets/default-pfp.jpg");
import moment from "moment";
import "moment/locale/sl";
moment.locale("sl");

export default {
  name: "AdminUserEdit",
  computed: {
    ...mapGetters({
      authenticated: "auth/authenticated",
      user: "auth/user",
      isAdmin: "auth/isAdmin",
    }),
  },
  emits: ["notify"],
  data() {
    return {
      editUser: {},
      error: "",
      notice: "",
      muteDays: null,
      mutedString: "",
      defaultPfp: defaultPfp,
    };
  },
  methods: {
    async getUser(id) {
      try {
        const response = await AdminService.getUser(id);

        if (response.data) {
          this.editUser = response.data;
        } else {
          this.$emit("notify", {
            type: "error",
            message: response,
          });
        }
        if (this.editUser.muteExpiration) {
          this.mutedString = moment(this.editUser.muteExpiration).format("LLL");
        }
      } catch (error) {
        this.$emit("notify", {
          type: "error",
          message: error,
        });
      }
    },
    copyID(id) {
      navigator.clipboard.writeText(id);
    },
    async updateUser() {
      try {
        const response = await AdminService.updateUser({
          _id: this.editUser._id,
          username: this.editUser.username,
          email: this.editUser.email,
        });

        if (response.status == 200) {
          this.$emit("notify", {
            type: "success",
            message: "Uporabnik je bil posodobljen",
          });
        } else {
          this.$emit("notify", {
            type: "error",
            message: response,
          });
        }
      } catch (error) {
        this.$emit("notify", {
          type: "error",
          message: error.message,
        });
      }
    },

    async removePfp() {
      try {
        await AdminService.removePfp(this.editUser._id);
        this.editUser.pfp = null;
        this.getUser(this.$route.params.id);
        this.$emit("notify", {
          type: "success",
          message: "Profilna slika odstranjena",
        });
      } catch (error) {
        this.$emit("notify", {
          type: "error",
          message: error.message,
        });
      }
    },

    async muteUser() {
      try {
        await AdminService.muteUser(this.editUser._id, this.muteDays);
        this.muteDays = null;
        this.getUser(this.$route.params.id);
        this.$emit("notify", {
          type: "success",
          message: "Muted",
        });
      } catch (error) {
        this.$emit("notify", {
          type: "error",
          message: error.message,
        });
      }
    },

    async unmuteUser() {
      try {
        await AdminService.unmuteUser(this.editUser._id);
        this.muteDays = null;
        this.getUser(this.$route.params.id);
        this.$emit("notify", {
          type: "success",
          message: "Unmuted",
        });
      } catch (error) {
        this.$emit("notify", {
          type: "error",
          message: error.message,
        });
      }
    },
  },
  beforeMount() {
    if (!this.isAdmin) {
      router.push("/login");
    }

    this.getUser(this.$route.params.id);
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
  @apply text-red-600 mt-2;
}

.backgroundRed {
  @apply bg-red-500 hover:bg-red-500;
}

.borderRed {
  @apply border-red-500 focus:border-red-500;
}
</style>
