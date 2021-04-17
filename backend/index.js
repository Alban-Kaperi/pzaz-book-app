const express = require("express");
const app = express();
const mongoose= require("mongoose");
require('dotenv').config()



var cors = require('cors');// allow access from other domains
const corsOptions = {
  exposedHeaders: 'auth-token',
};
app.use(cors(corsOptions)); // we expose the header just to test if we receive the jwt

// creating middleware to allow only logged in users to crud books
const verify = require("./verifyToken");

// Connect to DB
mongoose.connect(process.env.DB,
    {useNewUrlParser: true,
     useUnifiedTopology: true  },
    ()=>console.log("connected to database"));

// Import Routes
const authRoutes= require("./routes/auth.js");
const bookRoutes= require("./routes/books.js")

//Middleware
app.use(express.json());// we need to parse json requests

/*
* Route Middlewares
* adding a fixed path to our routes
*/
app.use('/api/user', authRoutes);

/*
* we apply the verify middleware that we created to ensure only the logged in users
* can crud the books
*/
app.use('/api/books',verify, bookRoutes);


app.listen(3000, ()=>{console.log("Backend server is running")});
