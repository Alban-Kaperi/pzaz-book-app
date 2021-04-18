<template>
  <div class="about">
    <el-row type="flex" class="row-bg" justify="center">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <el-form
            :model="ruleForm"
            status-icon
            :rules="rules"
            ref="ruleForm"
            class="demo-ruleForm"
          >
            <el-form-item label="Name" prop="name">
              <el-input
                type="text"
                v-model="ruleForm.name"
                autocomplete="off"
              ></el-input>
            </el-form-item>
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
            <el-form-item label="Confirm" prop="checkPass">
              <el-input
                type="password"
                v-model="ruleForm.checkPass"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">
                Submit
              </el-button>
              <el-button @click="resetForm('ruleForm')">Reset</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>

    <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
  </div>
</template>

<script>
import axios from "axios";
import { mapMutations } from "vuex";

export default {
  name: "Home",
  components: {
    //HelloWorld,
  },
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please input the password again"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("Two inputs don't match!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        name: "",
        email: "",
        pass: "",
        checkPass: "",
      },
      rules: {
        name: [
          {
            type: "string",
            required: true,
            message: "Please input name",
            trigger: "blur",
          },
          {
            min: 3,
            message: "Length should be above 3 characters",
            trigger: "blur",
          },
        ],
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
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
      },
    };
  },
  methods: {
    ...mapMutations,
    initializeBooks(value) {
      this.$store.commit("initBooksArray", value);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        // if it passes validation
        if (valid) {
          axios
            .post("http://localhost:3000/api/user/register", {
              name: this.ruleForm.name,
              email: this.ruleForm.email,
              password: this.ruleForm.pass,
              checkPass: this.ruleForm.checkPass,
            })
            .then((response) => {
              // get the jwt token from the header
              const authToken = response.headers["auth-token"];
              // set auth token to the local storage.
              localStorage.setItem("jwt", authToken);

              // Time expires after getTokenExpiration miliseconds we get from vuex store
              const expirationDate =
                new Date().getTime() + this.getTokenExpiration;

              // set jwtExpired in the local storage
              localStorage.setItem("jwtExpired", expirationDate);

              // we initialize books array in vuex with the help of initBooksArray method
              this.initBooksArray(localStorage.getItem("jwt"));

              // set user isLogged to true
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
          this.initializeBooks(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    setLogState(value) {
      this.$store.commit("setLogged", value);
    },
  },
};
</script>
