const express = require("express")
const {
    getProfile,
    updateProfile,
    getAllUsers,
    getUserById,
    updateUserRole,
    deleteUser
} = require("../controllers/userController")
const { protect } = require("../middlewares/authMiddleware")
const { admin } = require("../middlewares/adminMiddleware")

const router = express.Router()

// User profile routes
router.get("/profile", protect, getProfile)
router.put("/profile", protect, updateProfile)

// Admin user management routes
router.get("/", protect, admin, getAllUsers)
router.get("/:id", protect, admin, getUserById)
router.put("/:id/role", protect, admin, updateUserRole)
router.delete("/:id", protect, admin, deleteUser)

module.exports = router