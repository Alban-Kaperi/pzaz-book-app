<template>
  <el-table :data="getBooks" stripe style="width: 100%">
    <el-table-column prop="title" label="Title" width="120"> </el-table-column>
    <el-table-column prop="author" label="Author" width="100">
    </el-table-column>
    <el-table-column prop="description" label="Description" width="500">
    </el-table-column>
    <el-table-column prop="isbn" label="ISBN" width="160"></el-table-column>
    <el-table-column fixed="right" label="Operations" width="200">
      <template #default="scope">
        <el-button @click="handleClick">Edit</el-button>
        <el-button
          @click.prevent="deleteBook(scope.$index, scope.row.isbn, getBooks)"
          type="danger"
          >delete</el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  computed: {
    ...mapGetters(["getBooks"]), // get the array of books
  },
  methods: {
    ...mapMutations,
    deleteBook(index, isbn, rows) {
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
          // remove row from table
          rows.splice(index, 1);
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
  },
};
</script>

<style></style>
