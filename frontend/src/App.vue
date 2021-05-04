<template>
  <el-container style="font-family: 'Open Sans', sans-serif">
    <el-header>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
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
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      activeIndex: "1",
    };
  },
  name: "MainPage",
  computed: {
    ...mapGetters("user", ["isLogged"]), // get true if user is logged in false if not
  },
  methods: {
    ...mapActions("user", ["logout"]),
  },
};
</script>
