var jwt = require('jsonwebtoken');

const verifytoken=(req,res,next)=>{
    const token = req.header("auth-token");
    if(!token) return res.status(401).send("Access denied!");

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user= verified;
        next();
    } catch (error) {
        return res.status(400).send("Invalid oken!");
        
    }
}

module.exports=verifytoken;