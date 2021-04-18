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

export default router;
