const mongoose = require('mongoose');

const userSchema= new mongoose.Schema({
    author:{
        type: String,
        required: true,
        min:3
    },
    title:{
        type: String,
        required: true,
        min:6,
        max:255
    },
    description:{
        type: String,
        required: true,
        max:1024,
    },
    isbn:{//example 978-1-4028-9462-6
        type: String,
        required: true,
        min:17,
        max:17
    },
    poster_image:{
        type: String,
        required: true,
        max:255,
    },
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User",
    },
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports= mongoose.model("Book", userSchema);