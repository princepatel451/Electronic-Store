const mongoose = require("mongoose")

const userModel = new mongoose.Schema({
    name : {type: String, required: true, trim: true},
    email : {type: String, required: true, unique: true, trim: true, lowercase: true},
    password : {type: String, required: true, minlength:6},
    role: {type: String, enum: ["USER", "ADMIN"], default: "USER"}
},
{timestamps: true})

const User = mongoose.model("User", userModel)

module.exports = User;