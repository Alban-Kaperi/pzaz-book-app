import axios from "../axios_config";

import { ElNotification, ElMessageBox } from "element-plus";

// initial state
const state = () => ({
  books: [],
});

// getters
const getters = {
  // get books
  getBooks(state) {
    return state.books;
  },
};

// actions
const actions = {
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

    commit("ADD_Book", response.data);

    // display success notification
    ElNotification.success({
      title: "Success",
      message: "Book succesfully added!",
      offset: 100,
    });

    return true;
  },

  deleteBook({ commit }, payload) {
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
            //state.books.splice(payload.index, 1);

            // remove book from array in vuex
            commit("REMOVE_Book", payload.isbn);

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
    commit("UPDATE_Book", payload.book);

    // show succesful message
    ElNotification.success({
      title: "Success",
      message: "Book succesfully updated!",
      offset: 100,
    });

    return true;
  },
};

// mutations
const mutations = {
  // Initialize books array which come as a value from users module
  initBooksArray(state, value) {
    state.books = value;
  },
  // called from user module when user accesses logout action
  EMPTY_BookState(state) {
    state.books = [];
    state.editDialogBookForm = false;
    state.addDialogFormVisible = false;
  },
  // Add a new book
  ADD_Book(state, item) {
    state.books.push(item);
  },
  // update book
  UPDATE_Book(state, item) {
    console.log("brenda muttation update book");
    console.log(item);

    state.books.forEach((element, index) => {
      if (element._id === item._id) {
        state.books[index] = item;
      }
    });
  },
  // remove book
  REMOVE_Book(state, value) {
    state.books = state.books.filter((arrayitem) => arrayitem.isbn !== value);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
