const router= require("express").Router();
const Book = require("../model/Book.js");

// Get all books related to current user
router.get("/", async(req, res)=>{

    try {
        const allBooks = await Book.find({"user_id": req.user._id});//find all books of the user
        return res.json(allBooks);
      } catch (error) {
        return res.status(400).send(error);
      }
/*
------ A book info Example------
user_id: req.user._id,
author:"Andy Weir",
title:"The Martian",
description: `The Martian is a 2015 science fiction film directed by Ridley Scott and starring Matt Damon. Drew Goddard adapted the screenplay from The Martian, a 2011 novel by Andy Weir.`,
isbn:"978-1-4028-9462-6",
poster_image:"https://lumiere-a.akamaihd.net/v1/images/image_a119dd78.jpeg"
*/ 
});

// Create book from current authenticated user.
router.post("/", async(req, res)=>{

    //checking if isbn ofthe book exists
    const isbnExist = await Book.findOne({isbn : req.body.isbn});
    if(isbnExist) return res.status(400).send("Book exists, you cant duplicate it");

     // create new user
     const book = new Book({
        user_id: req.user._id,// from the middleware
        author:req.body.author,
        title:req.body.title,
        description: req.body.description,
        isbn: req.body.isbn,
        poster_image:req.body.poster_image
    });

    try {
        const savedBook= await book.save();
        return res.send({
            "message":`${savedBook.title} sucessfuly created!`,
        });        
    } catch (error) {
        return res.status(400).send(error);
    }
});

// Update book from current authenticated user.
router.put("/:bookID", async(req, res)=>{

    try {
        const updatedBook = await Book.updateOne(
          { _id: req.params.bookID},//find by book id
          { $set: { //update the field
                author:req.body.author,
                title:req.body.title,
                description: req.body.description,
                isbn: req.body.isbn,
                poster_image:req.body.poster_image
            } 
          }
        );
        return res.send({"message":`Book:${req.body.title} sucessfuly updated!`});
      } catch (error) {
        return res.status(400).send(error);
      }
});

// Delete book from current authenticated user.
router.delete("/:bookID", async(req, res)=>{

    try {
        const deletedBook = await Book.deleteOne({ _id: req.params.bookID});
        return res.send({"message":`Book: ${deletedBook.title} Sucessfuly deleted!`});
      } catch (error) {
        return res.status(400).send(error);
      }

});


module.exports= router;
