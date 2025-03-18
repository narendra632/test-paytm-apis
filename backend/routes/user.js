const express = require("express");
const zod = require("zod");
const router = express.Router();
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config");
const { User, Account } = require("../db");
const { authMiddleware } = require("../middleware");

const signupSchema = zod.object({
    username: zod.string().email(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string(),
})

const signinSchema = zod.object({
    username: zod.string().email(),
    password: zod.string()
})

const updateSchema = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
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

    const dbUser = await User.create(req.body);

    await Account.create({
        userId: dbUser._id,
        balance: 1+ Math.random()*1000
    })
    const token = jwt.sign({
        userId: dbUser._id
    }, JWT_SECRET)

    res.json({
        message: "User created successfully",
        token:token
    })
})


router.post("/signin", async(req, res)=>{
    const {success} = signinSchema.safeParse(req.body)
    if(!success){
        res.status(411).json({
            message: "Invalid inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
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


router.put("/", authMiddleware, async(req,res) => {
    const { success } = updateSchema.safeParse(req.body)
    if(!success){
        res.status(411).json({
            message: "Error while updating info"
        })
    }

    await User.updateOne(req.body, {
        id: req.userId
    })

    res.status(200).json({
        message: "Updated Successfully"
    })
})

router.get("/bulk", async(req, res) =>{
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex":filter 
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

module.exports = router;