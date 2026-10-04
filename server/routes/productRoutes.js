const express = require("express")
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require("../controllers/productController")
const { protect } = require("../middlewares/authMiddleware")
const { admin } = require("../middlewares/adminMiddleware")

const router = express.Router()

router.post("/create-product", protect, admin, createProduct)
router.get("/", getProducts)
router.get("/:id", getProductById)
router.put("/:id", protect, admin, updateProduct)
router.delete("/:id", protect, admin, deleteProduct)

module.exports = router