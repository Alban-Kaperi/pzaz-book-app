import { createStore } from "vuex";

import user from "./modules/user";
import books from "./modules/books";

export default createStore({
  modules: {
    user,
    books,
  },
  strict: true,
});
