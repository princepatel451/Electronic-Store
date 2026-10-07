const express = require("express")
const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    previewSamsungProduct,
    importSamsungProduct
} = require("../controllers/productController")
const { protect } = require("../middlewares/authMiddleware")
const { admin } = require("../middlewares/adminMiddleware")

const router = express.Router()

router.post("/create-product", protect, admin, createProduct)
router.post("/preview-samsung", protect, admin, previewSamsungProduct)
router.post("/import-samsung", protect, admin, importSamsungProduct)
router.get("/", getProducts)
router.get("/:id", getProductById)
router.put("/:id", protect, admin, updateProduct)
router.delete("/:id", protect, admin, deleteProduct)

module.exports = router