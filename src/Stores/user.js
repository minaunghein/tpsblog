import { defineStore } from "pinia";
import { login, register } from "../Services/user_services";
import jwtDecode from "jwt-decode";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
  }),
  actions: {
    async login(payload) {
      const user = await login(payload);
      const token = user.data.access_token;
      this.setToken(token);
    },

    async register(payload) {
      const user = await register(payload);
      const token = user.data.access_token;
      this.setToken(token);
    },

    logout() {
      this.user = null;
      localStorage.clear("token");
    },

    setToken(token) {
      localStorage.setItem("token", token);
      this.user = jwtDecode(token);
      console.log(this.user);
      return this.user;
    },
  },
});
