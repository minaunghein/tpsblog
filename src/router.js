import { createRouter, createWebHistory } from "vue-router";
import Login from "./components/login/login.vue";
import Register from "./components/register/register.vue";
import Home from "./components/home/home.vue";
import jwtDecode from "jwt-decode";
import { useUserStore } from "./Stores/user";

// const userStore = useUserStore();

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  { path: "/login", name: "login", component: Login },
  { path: "/register", name: "register", component: Register },
];

const getToken = () => localStorage.getItem("token");

function userToken() {
  const token = getToken() || null;
  const decodedToken = token ? jwtDecode(token) : null;
  return decodedToken;
}

// userStore.setToken(getToken());

const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach((to, from, next) => {
  if (to.path === "/login" && userToken()) return next("/");
  return next();
});

export default router;
