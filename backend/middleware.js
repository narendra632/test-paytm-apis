const JWT_SECRET = require("./config")
const jwt = require("jsonwebtoken")


const authMiddleware = (req, res, next) =>{
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(403).json({
            message: "User not logged in"
        });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, JWT_SECRET);
    try{
        if(decoded.userId){
            req.userId = decoded.userId;
            next();
        }
    } catch(err){
        return res.status(403).json({
            message: "cannot verify"
        })
    }
}

module.exports = {
    authMiddleware
}