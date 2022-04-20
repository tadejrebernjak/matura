<template>
  <h1 class="text-3xl border-b border-gray-600 pb-4 mb-10">
    <router-link to="/admin">Admin</router-link>
    > <span class="text-green-600">Uporabniki</span>
  </h1>
  <Searchbar @search="search" />
  <Paginator
    v-if="pages > 1"
    :pages="pages"
    :currentPage="currentPage"
    @changePage="changePage"
  />
  <OrderSelect :order="order" @select="orderSelect" />
  <table class="w-full">
    <tr class="rounded-t-md">
      <th class="pfp">Avatar</th>
      <th class="username">Username</th>
      <th class="email">Email</th>
      <th class="actions">Actions</th>
    </tr>
    <tr
      v-for="(user, index) in shownUsers"
      :item="user"
      :index="index"
      :key="user._id"
      :user="user"
    >
      <td class="text-center">
        <img class="avatar" :src="user.pfp || pfp" alt="Avatar" />
      </td>
      <td>
        {{ user.username }}
      </td>
      <td>
        <p>{{ user.email }}</p>
      </td>
      <td>
        <div class="actions-container">
          <span>
            <router-link :to="'/admin/user/' + user._id">
              <i class="fas fa-pen"></i>
              <div class="tooltip">
                <p>Edit</p>
              </div>
            </router-link>
          </span>
          <span @click="deleteUserConfirm(user._id)">
            <i class="fas fa-trash"></i>
            <div class="tooltip">
              <p>Delete</p>
            </div>
          </span>
        </div>
      </td>
    </tr>
  </table>
  <Paginator
    v-if="pages > 1"
    :pages="pages"
    :currentPage="currentPage"
    @changePage="changePage"
  />
  <Alert
    :text="'Želite zavedno izbrisati uporabnika?'"
    :open="alert"
    @ok="alertOK"
    @cancel="alertCancel"
  />
</template>

<script>
import pfp from "@/assets/default-pfp.jpg";
import { mapGetters } from "vuex";
import router from "../router";
import AdminService from "../adminService";
import Paginator from "@/components/Paginator";
import Searchbar from "@/components/Searchbar";
import OrderSelect from "@/components/OrderSelect";
import Alert from "@/components/Alert";

export default {
  name: "AdminUsers",
  components: {
    Paginator,
    Searchbar,
    OrderSelect,
    Alert,
  },
  emits: ["notify"],
  computed: {
    ...mapGetters({
      authenticated: "auth/authenticated",
      user: "auth/user",
      isAdmin: "auth/isAdmin",
    }),
  },
  data() {
    return {
      alert: false,
      users: [],
      shownUsers: [],
      pages: 10,
      currentPage: 1,
      order: "newest",
      deleteID: "",
      error: "",
      pfp: pfp,
    };
  },
  methods: {
    async getUsers() {
      try {
        this.users = await AdminService.getUsers();

        this.pages = Math.ceil(this.users.length / 30);
        this.changePageUsers();
      } catch (error) {
        this.error = error.message;
      }
    },
    changePage(newPage) {
      this.currentPage = newPage;
      this.changePageUsers();
    },
    changePageUsers() {
      this.shownUsers = this.users.slice(
        (this.currentPage - 1) * 30,
        this.currentPage * 30
      );
    },
    async search(query) {
      if (query != "") {
        this.users = await AdminService.searchUsers(query);
      } else {
        this.users = await AdminService.getUsers();
      }

      this.changePageUsers();
    },
    orderSelect(order) {
      this.order = order;

      this.orderUsers();
      this.changePageUsers();
    },
    orderUsers() {
      switch (this.order) {
        case "newest":
          this.users.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
          break;
        case "oldest":
          this.users.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
          break;
        default:
          this.users.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
          break;
      }
    },
    deleteUserConfirm(userID) {
      this.deleteID = userID;
      this.alert = true;
    },
    alertOK() {
      this.alert = false;

      this.deleteUser(this.deleteID);
    },
    alertCancel() {
      this.alert = false;
      this.deleteID = "";
    },
    async deleteUser(userID) {
      try {
        await AdminService.deleteUser(userID);

        this.getUsers();
        this.$emit("notify", {
          type: "success",
          message: "Izbrisal uporabnika",
        });
      } catch (error) {
        this.error = error.message;
      }
    },
  },
  beforeMount() {
    if (!this.isAdmin) {
      router.push("/login");
    }

    this.getUsers();
  },
};
</script>

<style scoped>
table {
  @apply my-5 rounded-t-md;
}

th {
  @apply bg-green-500 border border-gray-300 text-white font-semibold text-lg p-2;
}

td {
  @apply p-2 border border-gray-300;
}

tr:nth-child(even) {
  @apply bg-gray-100;
}

.source {
  width: 10%;
}

.title {
  width: 60%;
}

.datetime {
  width: 15%;
}

.actions {
  width: 15%;
}

.actions-container {
  @apply flex justify-center flex-row;
}

td span {
  @apply mx-2 relative cursor-pointer;
}

.tooltip {
  @apply absolute bg-white border border-gray-400 rounded-md py-1 px-2 shadow-md font-semibold;
  top: -40px;
  left: -50%;
  display: none;
}

td span:hover .tooltip {
  display: block;
}

.avatar {
  @apply rounded-full h-10 w-10 object-cover mx-auto;
}
</style>
