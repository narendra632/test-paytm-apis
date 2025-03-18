const mongoose = require('mongoose');
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI);

const userSchema =new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: String,
    firstName: String,
    lastName: String,
})

const User = mongoose.model("Users", userSchema)

module.exports = {
    User,
}