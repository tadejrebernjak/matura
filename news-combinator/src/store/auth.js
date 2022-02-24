import api from "../../service/baseService";

export default {
  namespaced: true,
  state: {
    token: null,
    user: null,
  },

  getters: {
    authenticated(state) {
      if (state.token && state.user) {
        return true;
      } else {
        return false;
      }
    },

    user(state) {
      return state.user;
    },
  },

  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
    },

    SET_USER(state, user) {
      state.user = user;
    },
  },

  actions: {
    saveToken({ dispatch }, token) {
      localStorage.setItem("token", token);

      dispatch("tryToken");
    },

    async tryToken({ commit }) {
      try {
        let response = await api.post("users/token");

        commit("SET_TOKEN", localStorage.getItem("token"));
        commit("SET_USER", response.data);
      } catch (error) {
        localStorage.removeItem("token");
        commit("SET_USER", null);
        commit("SET_TOKEN", null);
      }
    },

    logout({ commit }) {
      localStorage.removeItem("token");
      commit("SET_USER", null);
      commit("SET_TOKEN", null);
    },
  },
};