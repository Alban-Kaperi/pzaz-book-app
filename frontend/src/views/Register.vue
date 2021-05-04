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
import { mapActions } from "vuex";

export default {
  name: "Home",
  components: {
    //HelloWorld,
  },
  data() {
    return {
      ruleForm: {
        name: "",
        email: "",
        pass: "",
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
      },
    };
  },
  methods: {
    // user module, register method
    ...mapActions("user", ["register"]),
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        // dispatch register action
        this.register({
          valid: valid,
          name: this.ruleForm.name,
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
