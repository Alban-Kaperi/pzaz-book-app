import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";

const routes = [
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/register",
    name: "register",
    // route level code-splitting
    // this generates a separate chunk (register.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "register" */ "../views/Register.vue"),
  },
  {
    path: "/",
    name: "books",
    component: () =>
      import(/* webpackChunkName: "booklist" */ "../views/BookList.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// check if user is logged
router.beforeEach((to, from, next) => {
  const auth = isAuthenticated();
  // if we want to go to books route but we are not authenticated, we redirect to login
  if (to.name == ["books"] && !auth) next({ name: "login" });
  else next();
});

function isAuthenticated() {
  const jwtToken = localStorage.getItem("jwt"); // get token from local storage
  const currentTime = new Date().getTime(); // get current time in milliseconds
  const savedTime = localStorage.getItem("jwtExpiredTime"); //get expiration time from l. storage

  if (jwtToken || savedTime > currentTime) return true;
  else return false;
}

export default router;
