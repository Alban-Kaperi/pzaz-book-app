<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="formVisible = true"
      >Add new Book</el-button
    >
    <!-- edit form data -->
    <el-dialog title="Edit Book Info" v-model="formVisible">
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
          <el-button @click="formVisible = false">Cancel</el-button>
          <el-button type="primary" @click="addBookInDB()">Confirm</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      formVisible: false,
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
    ...mapActions("books", ["addBook", "setAddDialogBookForm"]),
    async addBookInDB() {
      const response = await this.addBook(this.form);

      if (response) {
        // empty the form data
        this.form.id = "";
        this.form.title = "";
        this.form.description = "";
        this.form.author = "";
        this.form.isbn = "";
        this.form.poster_image = "";

        // close the pop up form
        this.formVisible = false;
      }
    },
  },
};
</script>
