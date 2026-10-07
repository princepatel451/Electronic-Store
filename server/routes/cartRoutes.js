const express = require("express")
const {
    addToCart,
    getCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart
} = require("../controllers/cartController")
const { protect } = require("../middlewares/authMiddleware")

const router = express.Router()

router.post("/", protect, addToCart)
router.get("/", protect, getCart)
router.put("/item/:productId", protect, updateCartItemQuantity)
router.delete("/item/:productId", protect, removeFromCart)
router.delete("/clear", protect, clearCart)

module.exports = router