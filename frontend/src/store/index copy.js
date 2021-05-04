import { createStore } from "vuex";
import axios from "axios";
axios.defaults.baseURL = "http://localhost:3000/api";

import router from "../router/index";

import { ElNotification, ElMessageBox } from "element-plus";

export default createStore({
  state: {
    /*
     * token and isLogged are for optional configurations
     * in case we dont want to use the localStorage
     */
    token: null,
    isLogged: false,
    tokenExpiration: 60 * 60 * 1000, // we will set it to 1hour(60min*60sec*1000ms)
    books: [],
    editDialogBookForm: false,
    addDialogFormVisible: false,
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
    getEditDialogBookFormState(state) {
      return state.editDialogBookForm;
    },
    getAddDialogFormVisible(state) {
      return state.addDialogFormVisible;
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
      console.log("brenda muttation update book");
      console.log(item);

      state.books.forEach((element, index) => {
        if (element._id === item._id) {
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
    SET_EditDialogBookForm(state, value) {
      state.editDialogBookForm = value;
    },
    SET_AddDialogFormVisible(state, value) {
      state.addDialogFormVisible = value;
    },
  },
  actions: {
    //Actions related to User login, logout, register
    logout({ commit }) {
      console.log("logout inside vuex");
      // clear user info if we have been logged before
      localStorage.clear();

      // logout the user
      commit("setLogged", false);

      // clear all info in state
      commit("emptySate");
    },
    async login({ dispatch, commit, state }, payload) {
      // if it passes validation
      if (payload.valid) {
        const response = await axios.post("/user/login", {
          email: payload.email,
          password: payload.password,
        });

        if (!response) {
          // notify with error authentication.
          ElNotification.error({
            title: "Error",
            message: "Authentication Error!",
            offset: 100,
          });
          return false;
        }

        console.log();
        // clear all previous information form local storage
        localStorage.clear();

        // clear info in in vuex state.
        commit("emptySate");

        // get the jwt token from the header
        const authToken = response.headers["auth-token"];

        // set auth token to the local storage.
        localStorage.setItem("jwt", authToken);

        // calculate expiration time
        const expirationDate = new Date().getTime() + state.tokenExpiration;

        // set jwtExpired in the local storage
        localStorage.setItem("jwtExpired", expirationDate);

        // set user isLogged to true in vuex store
        commit("setLogged", true);

        // we call the initBooksArray in actions
        dispatch("initBooksArray", authToken);

        // redirected to the books route
        router.push({ name: "books" });

        // notify with succes message that data is succesfully sent to server.
        ElNotification.success({
          title: "Success",
          message: "User succesfully logged in",
          offset: 100,
        });
        return true;
      } else {
        // notify with error submit.
        ElNotification.error({
          title: "Error",
          message: "Submit error!",
          offset: 100,
        });
        return false;
      }
    },

    isLogged({ commit }) {
      const jwtToken = localStorage.getItem("jwt"); // get token from local storage
      const currentTime = new Date().getTime(); // get current time in milliseconds
      const savedTime = localStorage.getItem("jwtExpired"); //get expiration time from l. storage
      //we check if we dont have a token or it has expired
      if (!(jwtToken || savedTime > currentTime)) {
        // set user isLogged to false in vuex
        commit("setLogged", false);

        // if false redirected to the login route
        router.push({ name: "login" });
        return false;
      }

      return true;
    },
    // Actions related to books
    initBooksArray({ commit }, jwtToken) {
      axios
        .get("/books/", {
          headers: {
            "auth-token": jwtToken,
          },
        })
        .then((response) => {
          // initialize the books array in the vuex store with the books of the database.
          commit("initBooksArray", response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    // set the edit book dialog form
    setDialogBookForm({ commit }, value) {
      commit("SET_EditDialogBookForm", value);
    },
    // set the add book dialog form
    setAddDialogBookForm({ commit }, value) {
      commit("SET_AddDialogFormVisible", value);
    },
    // Add a new Book
    async addBook({ commit }, payload) {
      const response = await axios.post("books/", payload, {
        headers: {
          "auth-token": localStorage.getItem("jwt"),
        },
      });

      if (!response) {
        ElNotification.error({
          title: "Error",
          message: "Book cant be added!",
          offset: 100,
        });
        return false;
      }

      console.log("async add book in actions response data: " + response.data);
      commit("addBook", response.data);
      //close the dialog form
      commit("SET_AddDialogFormVisible", false);
      // display success notification
      ElNotification.success({
        title: "Success",
        message: "Book succesfully added!",
        offset: 100,
      });

      return true;
    },

    deleteBook({ commit, state }, payload) {
      ElMessageBox.confirm(
        "This will permanently delete the book. Continue?",
        "Warning",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning",
          center: true,
        }
      )
        .then(() => {
          axios
            .delete(`books/${payload._id}`, {
              headers: {
                "auth-token": localStorage.getItem("jwt"),
              },
            })
            .then(() => {
              // remove row from table
              state.books.splice(payload.index, 1);
              // remove book from array in vuex
              commit("removeBook", payload.isbn);

              // show succesful notification
              ElNotification.success({
                title: "Success",
                message: "Book succesfully deleted!",
                offset: 100,
              });
            })
            .catch(function () {
              ElNotification.error({
                title: "Error",
                message: "Delete cancelled!",
                offset: 100,
              });
            });
        })
        .catch(() => {
          ElNotification.error({
            title: "Error",
            message: "Delete cancelled!",
            offset: 100,
          });
        });
    },

    async updateBook({ commit }, payload) {
      const response = await axios.put(
        `/books/${payload.book._id}`,
        payload.book,
        {
          headers: {
            "auth-token": localStorage.getItem("jwt"),
          },
        }
      );

      if (!response) {
        // notify with error authentication.
        ElNotification.error({
          title: "Error",
          message: "Book cant be updated!",
          offset: 100,
        });
        return false;
      }

      // update the book in vuex books array
      commit("updateBook", payload.book);

      // close the dialog box setDialogBookForm
      commit("SET_EditDialogBookForm", false);

      // show succesful message
      ElNotification.success({
        title: "Success",
        message: "Book succesfully updated!",
        offset: 100,
      });

      return true;
    },
  },
});
