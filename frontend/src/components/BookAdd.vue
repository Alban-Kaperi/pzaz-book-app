<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="openAddBookDialog()">Add new Book</el-button>
    <!-- edit form data -->
    <el-dialog title="Edit Book Info" v-model="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="Title" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Author" :label-width="formLabelWidth">
          <el-input v-model="form.author" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Description" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            v-model="form.description"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="ISB" :label-width="formLabelWidth">
          <el-input v-model="form.isbn" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Poster Image" :label-width="formLabelWidth">
          <el-input v-model="form.poster_image" autocomplete="off"></el-input>
        </el-form-item>
        <span>ISBN Example: 978-1-4028-9462-6</span>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">Cancel</el-button>
          <el-button type="primary" @click="addBook()">Confirm</el-button>
        </span>
      </template>

    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      dialogFormVisible: false,
      form: {
        id: "",
        title: "",
        description: "",
        author: "",
        isbn: "",
        poster_image: "",
      },
      formLabelWidth: "150px",
    };
  },
  methods: {
    ...mapMutations,
    openAddBookDialog() {
      // show dialog box
      this.dialogFormVisible = true;
    },
    addBook() {
      const formData = this.form;
      axios
        .post("http://localhost:3000/api/books/", formData, {
          headers: {
            "auth-token": localStorage.getItem("jwt"),
          },
        })
        .then(() => {
          // update the book in vuex books array
          this.$store.commit("addBook", formData);
          // close the dialog box
          this.dialogFormVisible = false;

          //empty the form data
          this.form.id = "";
          this.form.title = "";
          this.form.description = "";
          this.form.author = "";
          this.form.isbn = "";
          this.form.poster_image = "";

          // show succesful message
          this.$message({
            type: "success",
            message: "Succesfully added",
          });
          // reload the page
          this.$router.push({ name: "login" });
        })
        .catch(function () {
          this.$message({
            type: "error",
            message: "Problem adding the book!",
          });
        });
    },
  },
};
</script>
