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
            editTableRowBook(
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
          @click.prevent="
            deleteBook({
              index: scope.$index,
              _id: scope.row._id,
              isbn: scope.row.isbn,
            })
          "
          type="danger"
          icon="el-icon-delete"
          >delete</el-button
        >
      </template>
    </el-table-column>
  </el-table>
  <!-- edit form data -->
  <el-dialog title="Edit Book Info" v-model="editDialogBookForm">
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
        <el-button @click="editDialogBookForm = false">Cancel</el-button>
        <el-button type="primary" @click="updateBookInDB()">Confirm</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import BookAdd from "../components/BookAdd";
export default {
  components: {
    BookAdd,
  },
  data() {
    return {
      editDialogBookForm: false,
      itemIndex: null, // index of the item in the array
      form: {
        //book form
        _id: "", //book _id
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
    ...mapGetters("books", ["getBooks"]), // get the array of books
  },
  methods: {
    ...mapActions("user", ["initBooksArray"]),
    ...mapActions("books", [
      "updateBook",
      "setEditDialogBookForm",
      "deleteBook",
    ]),
    editTableRowBook(index, _id, title, author, description, image, isbn) {
      // show dialog box
      this.editDialogBookForm = true;

      this.itemIndex = index;
      // get book data from table
      this.form._id = _id;
      this.form.title = title;
      this.form.author = author;
      this.form.description = description;
      this.form.poster_image = image;
      this.form.isbn = isbn;
    },
    async updateBookInDB() {
      //remove pointer from the form
      const formData = JSON.parse(JSON.stringify(this.form));
      // dispatch updateBook action
      const response = await this.updateBook({ book: formData });

      // if the update is succesful than we close the dialog box
      if (response) this.editDialogBookForm = false;
    },
  },
  created() {
    this.initBooksArray(localStorage.getItem("jwt"));
  },
};
</script>
