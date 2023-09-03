import { defineStore } from "pinia";
import { login, register } from "../Services/user_services";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { Toast } from "../utils/toast";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
  }),
  actions: {
    async login(payload) {
      const toast = new Toast();
      try {
        toast.loading("Logging in.....");
        const user = await login(payload);
        const token = user.data.access_token;
        this.setToken(token);
        toast.success("Successfully logged in!");
      } catch (error) {
        toast.error(error);
        throw error;
      }
    },

    async register(payload) {
      const toast = new Toast();
      try {
        toast.loading("Registering.....");

        const user = await register(payload);
        const token = user.data.access_token;
        this.setToken(token);
        toast.success("Registration successful!");
      } catch (error) {
        toast.error(error);
        const message =
          error?.response?.data?.message || error?.message || error;
        throw new Error(message);
      }
    },

    logout() {
      const toast = new Toast();

      this.user = null;
      localStorage.clear("token");
      axios.defaults.headers.common["Authorization"] = null;
      toast.success("Succesfully logged out!");
    },

    setToken(token) {
      localStorage.setItem("token", token);
      this.user = jwtDecode(token);
      console.log(this.user);
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      return this.user;
    },
  },
});
