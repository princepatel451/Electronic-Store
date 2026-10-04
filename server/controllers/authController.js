const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Generate Token for verifying credentials
const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        {expiresIn: "7d"}
    )
}

// Register User
const registerUser = async(req, res) => {
    const {name, email, password, role} = req.body

    try{
        const existingUser = await User.findOne({email})

        if(existingUser){
            return res.status(400).json({success: false, message: "User Already Exists"})
        }
        
        if(password.length < 6){
            return res.status(400).json({success: false, message: "Password must be at least 6 characters"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            name, email, password: hashedPassword, role
        })

        res.status(201).json({
            success: true,
            message: "User Registered Successfully",
            user: {
                id : user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })


    }
    catch(error){
        res.status(500).json({
            success: false,
            message: " Server Error",
            error: error.message
        })
    }
}


// Login User
const loginUser = async(req, res) => {
    const {email, password} = req.body

    try{
        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        const token = generateToken(user._id)

        res.status(200).json({
            success: true,
            message: "Login Successful",
            token
        })
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


module.exports = {registerUser, loginUser}