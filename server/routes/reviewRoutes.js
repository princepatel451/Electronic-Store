const express = require("express")
const {
    createReview,
    getProductReviews,
    deleteReview
} = require("../controllers/reviewController")
const { protect } = require("../middlewares/authMiddleware")

const router = express.Router()

router.post("/", protect, createReview)
router.post("/:productId", protect, createReview)
router.get("/product/:productId", getProductReviews)
router.delete("/:id", protect, deleteReview)

module.exports = router
