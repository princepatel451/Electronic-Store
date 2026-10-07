const User = require("../models/User")
const bcrypt = require("bcryptjs")

// Get logged-in user profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password")
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "User Fetched Successfully",
            user
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Update logged-in user profile
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        const { name, email, password } = req.body

        if (name) user.name = name
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email })
            if (emailExists) {
                return res.status(400).json({
                    success: false,
                    message: "Email is already in use"
                })
            }
            user.email = email
        }

        if (password) {
            if (password.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: "Password must be at least 6 characters"
                })
            }
            user.password = await bcrypt.hash(password, 10)
        }

        const updatedUser = await user.save()

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role
            }
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Admin: Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password").sort({ createdAt: -1 })

        res.status(200).json({
            success: true,
            users
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Admin: Get single user by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password")
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        res.status(200).json({
            success: true,
            user
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Admin: Update user role
const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body
        if (!role || !["USER", "ADMIN"].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role. Role must be 'USER' or 'ADMIN'"
            })
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true, runValidators: true }
        ).select("-password")

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "User role updated successfully",
            user
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Admin: Delete user
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    getProfile,
    updateProfile,
    getAllUsers,
    getUserById,
    updateUserRole,
    deleteUser
}