const express = require("express")
const {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    getAllOrders,
    updateOrderStatus,
    updatePaymentStatus,
    getSamsungFulfillmentPackage,
    updateFulfillmentStatus
} = require("../controllers/orderController")
const { protect } = require("../middlewares/authMiddleware")
const { admin } = require("../middlewares/adminMiddleware")

const router = express.Router()

// User routes
router.post("/", protect, createOrder)
router.get("/my-orders", protect, getMyOrders)
router.get("/:id", protect, getOrderById)
router.put("/:id/cancel", protect, cancelOrder)

// Admin routes
router.get("/", protect, admin, getAllOrders)
router.put("/:id/status", protect, admin, updateOrderStatus)
router.put("/:id/payment", protect, admin, updatePaymentStatus)
router.get("/:id/samsung-fulfillment", protect, admin, getSamsungFulfillmentPackage)
router.put("/:id/samsung-fulfillment", protect, admin, updateFulfillmentStatus)

module.exports = router
