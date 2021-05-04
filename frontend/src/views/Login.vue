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

import { mapActions } from "vuex";

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
  methods: {
    // user is the name of the module, login and isLogged are actions inside that module
    ...mapActions("user", ["login", "isLogged"]),
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        // dispatch login action
        this.login({
          valid: valid,
          email: this.ruleForm.email,
          password: this.ruleForm.pass,
        });
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>
