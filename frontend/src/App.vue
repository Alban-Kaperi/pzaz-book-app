<template>
  <el-container style="font-family: 'Open Sans', sans-serif">
    <el-header>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
      >
        <el-menu-item index="1"
          ><router-link to="/login" style="text-decoration: none">
            Books</router-link
          ></el-menu-item
        >
        <el-row v-if="!isLogged" type="flex" style="float: right">
          <el-menu-item index="2"
            ><router-link
              to="/login"
              style="text-decoration: none; color: white"
              >Login</router-link
            ></el-menu-item
          >
          <el-menu-item index="3"
            ><router-link
              to="/register"
              style="text-decoration: none; color: white"
              >Register</router-link
            ></el-menu-item
          >
        </el-row>
        <el-menu-item v-else index="4" style="float: right"
          ><router-link
            @click="logout()"
            to="/login"
            style="text-decoration: none"
          >
            Log out</router-link
          ></el-menu-item
        >
      </el-menu>
    </el-header>
    <el-main>
      <el-row type="flex" class="row-bg" justify="center">
        <el-col :lg="20" :xl="20">
          <router-view />
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
const axios = require("axios");
import { mapGetters, mapMutations } from "vuex";

export default {
  data() {
    return {
      activeIndex: "1",
    };
  },
  name: "MainPage",
  computed: {
    ...mapGetters(["isLogged"]), // get true if user is logged in false if not
  },
  methods: {
    ...mapMutations,
    initializeBooks(jwtToken) {
      axios
        .get("http://localhost:3000/api/books/", {
          headers: {
            "auth-token": jwtToken,
          },
        })
        .then((response) => {
          // initialize the books array in the vuex store with the books of the database.
          this.$store.commit("initBooksArray", response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    setLogState(value) {
      this.$store.commit("setLogged", value);
    },
    logout() {
      // logout the user
      this.$store.commit("setLogged", false);
      // clear user info if we have been logged before
      localStorage.clear();

      // clear books array in vuex
      this.$store.commit("emptyBooksArray");
    },
  },
  created() {
    const jwtToken = localStorage.getItem("jwt"); // get token from local storage
    const currentTime = new Date().getTime(); // get current time in milliseconds
    const jwtTokenTime = localStorage.getItem("jwtExpired"); //get expiration time from l. storage
    //we check if we have a token and it has not expired
    if (jwtToken && jwtTokenTime > currentTime) {
      // Initialize books array at vuex
      this.initializeBooks(jwtToken);

      // set user isLogged to true in vuex
      this.setLogState(true);
    } else {
      // set user isLogged to false in vuex
      this.setLogState(false);
      // redirected to the books route
      this.$router.push({ name: "login" });
    }
  },
};
</script>
