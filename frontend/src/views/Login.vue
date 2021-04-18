<template>
  <div class="home">
    <el-row type="flex" class="row-bg" justify="center">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <el-form
            :model="ruleForm"
            @submit.prevent
            status-icon
            :rules="rules"
            ref="ruleForm"
            class="demo-ruleForm"
          >
            <el-form-item label="Email" prop="email">
              <el-input
                type="text"
                v-model="ruleForm.email"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="Password" prop="pass">
              <el-input
                type="password"
                v-model="ruleForm.pass"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">
                Log in
              </el-button>
              <el-button @click="resetForm('ruleForm')">Reset</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div>
          Note: You can use a temporary user with: Email:<b> alban@test.com</b>
          Password: <b>123456</b>
        </div>
      </el-col>
    </el-row>

    <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
  </div>
</template>

<script>
// @ is an alias to /src
const axios = require("axios");
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "Login",
  data() {
    return {
      ruleForm: {
        email: "",
        pass: "",
      },
      rules: {
        email: [
          {
            type: "email",
            required: true,
            message: "Please input email",
            trigger: "blur",
          },
          {
            min: 6,
            message: "Length should be above 6 characters",
            trigger: "blur",
          },
        ],
        pass: [
          {
            required: true,
            message: "Please input password form",
            trigger: "blur",
          },
          {
            min: 6,
            message: "Length should be above 6 characters",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["getTokenExpiration"]), // get token expiraton time from vuex
  },
  methods: {
    ...mapMutations,
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        // if it passes validation
        if (valid) {
          axios
            .post("http://localhost:3000/api/user/login", {
              email: this.ruleForm.email,
              password: this.ruleForm.pass,
            })
            .then((response) => {
              // clear all previous information form local storage
              localStorage.clear();

              // clear info in in vuex state.
              this.$store.commit("emptySate");

              // get the jwt token from the header
              const authToken = response.headers["auth-token"];

              // set auth token to the local storage.
              localStorage.setItem("jwt", authToken);

              // calculate expiration time
              const expirationDate =
                new Date().getTime() + this.getTokenExpiration;

              // set jwtExpired in the local storage
              localStorage.setItem("jwtExpired", expirationDate);

              // we initialize books array in vuex with the help of initBooksArray method
              this.initBooksArray(localStorage.getItem("jwt"));

              // set user isLogged to true in vuex store
              this.setLogState(true);

              // redirected to the books route
              this.$router.push({ name: "books" });
            })
            .catch(function (error) {
              console.log(error);
            });

          // notify with succes message that data is succesfully sent to server.
          this.$notify.success({
            title: "Success",
            message: "User succesfully logged in",
            offset: 100,
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    initBooksArray(jwtToken) {
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
  },
  mounted() {
    const jwtToken = localStorage.getItem("jwt"); // get token from local storage
    const currentTime = new Date().getTime(); // get current time in milliseconds
    const jwtTokenTime = localStorage.getItem("jwtExpired"); //get expiration time from l. storage
    //we check if we have a token and it has not expired
    if (jwtToken && jwtTokenTime > currentTime) {
      // redirect to books page
      this.$router.push({ name: "books" });
    }
  },
};
</script>
