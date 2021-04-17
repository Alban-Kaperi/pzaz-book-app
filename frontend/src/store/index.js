import { createStore } from "vuex";

export default createStore({
  state: {
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
    setToken(state, value){
      state.token = value;
    },
    initBooksArray(state, value){
      state.books = value;
    },
    addBook(state, value){
      state.books.push(value);
    },
    removeBook(state, value){
      state.books = state.books.filter((arrayitem) => arrayitem.isbn !== value);
    },
    setLogged(state, value){
      state.isLogged = value;
    },
  },
  actions: {},
});
