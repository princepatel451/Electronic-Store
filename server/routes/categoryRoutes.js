const express = require("express")
const { createCategory, getCategory, getCategoryById, updateCategory, deleteCategory } = require("../controllers/categoryController")
const { protect } = require("../middlewares/authMiddleware")
const { admin } = require("../middlewares/adminMiddleware")

const router = express.Router()

router.post("/create-category",protect, admin, createCategory)
router.get("/", getCategory)
router.get("/:id",getCategoryById)
router.put("/:id",protect, admin, updateCategory)
router.delete("/:id", protect, admin, deleteCategory)

module.exports = router