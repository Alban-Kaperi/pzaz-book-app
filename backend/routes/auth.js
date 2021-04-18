const router= require("express").Router();
const User = require("../model/User.js");
const {registerValidation, loginValidation} = require("../validation.js");
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');


// Register user
router.post("/register", async(req, res)=>{
    // data validation before creating a user
    const {error} = registerValidation(req.body);

    if(error) return res.status(400).send(error.details[0].message);
    
    //checking if the user exists
    const emailExists = await User.findOne({email : req.body.email});
    if(emailExists) return res.status(400).send("Email exists");

    // Hash password
    var salt = bcrypt.genSaltSync(10); //generate salt
    var hash = bcrypt.hashSync(req.body.password, salt); //generate hash
    
    // create new user
    const user = new User({
        name:req.body.name,
        email:req.body.email,
        password:hash
    });

    try {
        const savedUser= await user.save();
        // create and assign jwt token, which expires in 3600 seconds
        var token = jwt.sign({ _id: savedUser._id }, process.env.TOKEN_SECRET, { expiresIn: 60 * 60 });
        res.header('auth-token', token);// we add the token to the header

        return res.send({
            "message":"sucessfuly created",
            "userid":savedUser._id
        });        
    } catch (error) {
        return res.status(400).send(error);
    }
});

// Login user
router.post("/login", async(req, res)=>{
    // data validation before creating a user
    const {error} = loginValidation(req.body);

    if(error) return res.status(400).send(error.details[0].message);
    
    //checking if the user exists
    const user = await User.findOne({email : req.body.email});
    if(!user) return res.status(400).send("Auth failed!");

    // check if password is correct
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send("Invalid password");

    // create and assign jwt token, which expires in 3600 seconds
    var token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: 60 * 60 });
    res.header('auth-token', token);// we add the token to the header
    return res.send("logged in");
});

module.exports= router;
