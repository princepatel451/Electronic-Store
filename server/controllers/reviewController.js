const Review = require("../models/Review")
const { Product } = require("../models/Product")

// Helper function to update product rating and review count
const updateProductRating = async (productId) => {
    const reviews = await Review.find({ product: productId })
    const numReviews = reviews.length
    const rating = numReviews > 0
        ? reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews
        : 0

    await Product.findByIdAndUpdate(productId, {
        rating: Number(rating.toFixed(1)),
        numReviews
    })
}

// Create a review for a product
const createReview = async (req, res) => {
    try {
        const { rating, comment, productId } = req.body
        const targetProductId = productId || req.params.productId

        if (!targetProductId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            })
        }

        const ratingNum = Number(rating)
        if (!ratingNum || ratingNum < 1 || ratingNum > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            })
        }

        if (!comment || !comment.trim()) {
            return res.status(400).json({
                success: false,
                message: "Review comment is required"
            })
        }

        const product = await Product.findById(targetProductId)
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        // Check if user already reviewed this product
        const alreadyReviewed = await Review.findOne({
            user: req.user._id,
            product: targetProductId
        })

        if (alreadyReviewed) {
            return res.status(400).json({
                success: false,
                message: "You have already reviewed this product"
            })
        }

        const review = await Review.create({
            user: req.user._id,
            product: targetProductId,
            rating: ratingNum,
            comment: comment.trim()
        })

        // Recalculate and update product rating & numReviews
        await updateProductRating(targetProductId)

        res.status(201).json({
            success: true,
            message: "Review added successfully",
            review
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Get all reviews for a product
const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params

        const reviews = await Review.find({ product: productId })
            .populate("user", "name")
            .sort({ createdAt: -1 })

        res.status(200).json({
            success: true,
            reviews
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Delete a review (Author or Admin)
const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id)
        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            })
        }

        const isAuthor = review.user.toString() === req.user._id.toString()
        const isAdmin = req.user.role === "ADMIN"

        if (!isAuthor && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to delete this review"
            })
        }

        const productId = review.product
        await Review.findByIdAndDelete(req.params.id)

        // Recalculate product rating & numReviews
        await updateProductRating(productId)

        res.status(200).json({
            success: true,
            message: "Review deleted successfully"
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
    createReview,
    getProductReviews,
    deleteReview
}
