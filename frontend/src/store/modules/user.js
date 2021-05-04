import axios from "../axios_config";
import router from "../../router/index";
import { ElNotification } from "element-plus";

// initial state
const state = () => ({
  isLogged: localStorage.getItem("isLogged") ? true : false,
  tokenExpiration: 60 * 60 * 1000, // we will set it to 1hour(60min*60sec*1000ms)
});

// getters
const getters = {
  // get token expiration time
  getTokenExpiration(state) {
    return state.tokenExpiration;
  },
  // get loggin status, true if logged false if not
  isLogged(state) {
    return state.isLogged;
  },
};

// actions
const actions = {
  //logout the user
  logout({ commit }) {
    // reset to initial state of user and books module

    // clear localStorage info
    localStorage.clear();
    //clear users state
    commit("EMPTY_USER_STATE");
    //clear books state
    commit("books/EMPTY_BookState", null, { root: true });
  },

  async login({ dispatch, commit, state }, payload) {
    // if it passes validation
    if (payload.valid) {
      const response = await axios.post("/user/login", {
        email: payload.email,
        password: payload.password,
      });

      if (!response) {
        console.log("brenda if login");
        // notify with error authentication.
        ElNotification.error({
          title: "Error",
          message: "Authentication Error!",
          offset: 100,
        });
        return false;
      }

      // set auth token to the local storage.
      localStorage.setItem("jwt", response.headers["auth-token"]);

      // calculate expiration time
      const expirationDate = new Date().getTime() + state.tokenExpiration;

      // set jwtExpiredTime in the local storage
      localStorage.setItem("jwtExpiredTime", expirationDate);

      // set user isLogged to true in vuex store
      commit("SET_Logged", true);

      // we call the initBooksArray in actions
      dispatch("initBooksArray", response.headers["auth-token"]);

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
  async register({ dispatch, commit, state }, payload) {
    // if it passes validation
    if (payload.valid) {
      const response = await axios.post("/user/register", {
        name: payload.name,
        email: payload.email,
        password: payload.password,
      });

      if (!response) {
        // notify with error authentication.
        ElNotification.error({
          title: "Error",
          message: "User register Error!",
          offset: 100,
        });
        return false;
      }

      // set auth token to the local storage.
      localStorage.setItem("jwt", response.headers["auth-token"]);

      // calculate expiration time
      const expirationDate = new Date().getTime() + state.tokenExpiration;

      // set jwtExpiredTime in the local storage
      localStorage.setItem("jwtExpiredTime", expirationDate);

      // set user isLogged to true in vuex store
      commit("SET_Logged", true);

      // we call the initBooksArray in actions
      dispatch("initBooksArray", response.headers["auth-token"]);

      // redirected to the books route
      router.push({ name: "books" });

      // notify with succes message that data is succesfully sent to server.
      ElNotification.success({
        title: "Success",
        message: "User succesfully registered",
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

  // Initialize books array in books module with users books from database
  initBooksArray({ commit }, jwtToken) {
    axios
      .get("/books/", {
        headers: {
          "auth-token": jwtToken,
        },
      })
      .then((response) => {
        // commit initBooksArray mutation in books module with the books of the database.
        commit("books/initBooksArray", response.data, { root: true });
      })
      .catch(function (error) {
        console.log(error);
      });
  },
};

// mutations
const mutations = {
  //logged state true if logged in otherwise to false
  SET_Logged(state, value) {
    state.isLogged = value;
    //we also set it on localStorage
    localStorage.setItem("isLogged", value);
  },
  // empty vuex state after use is logged out
  EMPTY_USER_STATE(state) {
    // reset isLogged to false
    state.isLogged = false;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
