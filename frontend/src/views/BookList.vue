<template>
  <BookAdd style="margin: 30px 0 30px 0" />
  <el-table :data="getBooks" stripe style="width: 100%">
    <el-table-column label="Cover" width="180">
      <template #default="scope">
        <el-image :src="scope.row.poster_image" fit="fit"></el-image>
      </template>
    </el-table-column>
    <el-table-column prop="title" label="Title" width="120"> </el-table-column>
    <el-table-column prop="author" label="Author" width="100">
    </el-table-column>
    <el-table-column prop="description" label="Description" width="620">
    </el-table-column>
    <el-table-column prop="isbn" label="ISBN" width="160"></el-table-column>
    <el-table-column fixed="right" label="Operations" width="260">
      <template #default="scope">
        <el-button
          type="warning"
          icon="el-icon-edit"
          @click="
            editBook(
              scope.$index,
              scope.row._id,
              scope.row.title,
              scope.row.author,
              scope.row.description,
              scope.row.poster_image,
              scope.row.isbn
            )
          "
          >Edit</el-button
        >
        <el-button
          @click.prevent="deleteBook(scope.$index, scope.row.isbn, getBooks)"
          type="danger"
          icon="el-icon-delete"
          >delete</el-button
        >
      </template>
    </el-table-column>
  </el-table>
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
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="updateBook()">Confirm</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import axios from "axios";
import BookAdd from "../components/BookAdd";
export default {
  components: {
    BookAdd,
  },
  data() {
    return {
      dialogFormVisible: false,
      itemIndex: null, // index of the item in the array
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
  computed: {
    ...mapGetters(["getBooks"]), // get the array of books
  },
  methods: {
    ...mapMutations,
    deleteBook(index, isbn, tablebooks) {
      this.$confirm(
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
          //axios.
          // remove row from table
          tablebooks.splice(index, 1);
          // remove book from array in vuex
          this.$store.commit("removeBook", isbn);
          this.$message({
            type: "success",
            message: "Delete completed",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Delete canceled",
          });
        });
    },
    editBook(index, id, title, author, description, image, isbn) {
      // show dialog box
      this.dialogFormVisible = true;
      this.itemIndex = index;
      this.form.id = id;
      this.form.title = title;
      this.form.author = author;
      this.form.description = description;
      this.form.poster_image = image;
      this.form.isbn = isbn;
    },
    updateBook() {
      const formData = this.form;
      axios
        .put(`http://localhost:3000/api/books/${this.form.id}`, formData, {
          headers: {
            "auth-token": localStorage.getItem("jwt"),
          },
        })
        .then(() => {
          //update table row in current view
          this.getBooks[this.itemIndex] = formData;
          // update the book in vuex books array
          this.$store.commit("updateBook", formData);
          // close the dialog box
          this.dialogFormVisible = false;

          // empty the form data
          // this.form.id = "";
          // this.form.title = "";
          // this.form.description = "";
          // this.form.author = "";
          // this.form.isbn = "";
          // this.form.poster_image = "";

          // show succesful message
          this.$message({
            type: "success",
            message: "Delete completed",
          });
        })
        .catch(function () {
          this.$message({
            type: "error",
            message: "Not updated!",
          });
        });
    },
  },
};
</script>

<style></style>
