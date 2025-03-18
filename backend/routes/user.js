const express = require("express");
const zod = require("zod");
const router = express.Router();
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config");
const { User } = require("../db")

const signupSchema = zod.object({
    username: zod.string().email(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string(),
})

router.post("/signup", async(req, res) =>{
    const {success} = signupSchema.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message: "Email already taken/ invalid Inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username
    })
    if(user){
        return res.status(411).json({
            message: "Email already taken"
        })
    }

    const dbUser = await User.create(body);
    const token = jwt.sign({
        userId: dbUser._id
    }, JWT_SECRET)

    res.json({
        message: "User created successfully",
        token:token
    })
})


router.post("/signin", async(req, res)=>{
    const {success} = signupSchema.safeParse(req.body)
    if(!success){
        res.status(411).json({
            message: "Invalid inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username
    })
    if(user){
        const token = jwt.sign({
            userId:user._id
        }, JWT_SECRET)
        return res.status(200).json({
            message: "User login successfully",
            token:token
        })
    }
    res.status(411).json({
        message:"User not found in db, please signup"
    })
})

module.exports = router;