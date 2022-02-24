import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Article from "../views/Article.vue";
import Dashboard from "../views/Dashboard.vue";
import Profile from "../views/Profile.vue";
import Read from "../views/Read.vue";
import Liked from "../views/Liked.vue";
import Today from "../views/Today.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem("token")) {
        return next({
          name: "Dashboard",
        });
      }
      next();
    },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem("token")) {
        return next({
          name: "Dashboard",
        });
      }
      next();
    },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    beforeEnter: (to, from, next) => {
      if (!localStorage.getItem("token")) {
        return next({
          name: "Login",
        });
      }
      next();
    },
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    beforeEnter: (to, from, next) => {
      if (!localStorage.getItem("token")) {
        return next({
          name: "Login",
        });
      }
      next();
    },
  },
  {
    path: "/read",
    name: "Read",
    component: Read,
    beforeEnter: (to, from, next) => {
      if (!localStorage.getItem("token")) {
        return next({
          name: "Login",
        });
      }
      next();
    },
  },
  {
    path: "/liked",
    name: "Liked",
    component: Liked,
    beforeEnter: (to, from, next) => {
      if (!localStorage.getItem("token")) {
        return next({
          name: "Login",
        });
      }
      next();
    },
  },
  {
    path: "/today",
    name: "Today",
    component: Today,
  },
  {
    path: "/article/:id",
    name: "Article",
    component: Article,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
