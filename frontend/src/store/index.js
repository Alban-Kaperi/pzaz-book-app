import { createStore } from "vuex";

export default createStore({
  state: {
    /*
     * token and isLogged are for optional configurations
     * in case we dont want to use the localStorage
     */
    token: "",
    isLogged: false,
    tokenExpiration: 60 * 60 * 1000, // we will set it to 1hour(60min*60sec*1000ms)
    books: [],
  },
  getters: {
    getToken(state) {
      return state.token;
    },
    getTokenExpiration(state) {
      return state.tokenExpiration;
    },
    getBooks(state) {
      return state.books;
    },
    isLogged(state) {
      return state.isLogged;
    },
  },
  mutations: {
    setToken(state, value) {
      state.token = value;
    },
    initBooksArray(state, value) {
      state.books = value;
    },
    addBook(state, item) {
      state.books.push(item);
    },
    updateBook(state, item) {
      state.books.forEach((element, index) => {
        if (element.id === item.id) {
          state.books[index] = item;
        }
      });
    },
    removeBook(state, value) {
      state.books = state.books.filter((arrayitem) => arrayitem.isbn !== value);
    },
    setLogged(state, value) {
      state.isLogged = value;
    },
    emptySate(state) {
      state.books = [];
      state.token = "";
      state.isLogged = false;
    },
  },
  actions: {},
});
