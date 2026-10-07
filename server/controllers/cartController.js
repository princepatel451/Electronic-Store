const Cart = require("../models/Cart")
const { Product } = require("../models/Product")

// Add product to cart
const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product is Required"
            })
        }
        if (!Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be positive Integer"
            })
        }

        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product Not Found"
            })
        }

        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: "The Product is Out of Stock"
            })
        }

        let cart = await Cart.findOne({ user: req.user._id })

        if (!cart) {
            cart = new Cart({
                user: req.user._id,
                items: [
                    {
                        product: productId,
                        quantity
                    }
                ]
            })
        } else {
            const existingItem = cart.items.find(
                item => item.product.toString() === productId
            )

            if (existingItem) {
                const newQuantity = existingItem.quantity + quantity

                if (newQuantity > product.stock) {
                    return res.status(400).json({
                        success: false,
                        message: "Out of Stock"
                    })
                }
                existingItem.quantity = newQuantity
            } else {
                cart.items.push({ product: productId, quantity })
            }
        }

        await cart.save()
        await cart.populate("items.product")

        res.status(200).json({
            success: true,
            message: "Product added to cart",
            cart
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Get user's cart
const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            user: req.user._id
        }).populate("items.product")

        if (!cart) {
            return res.status(200).json({
                success: true,
                message: "Cart is empty",
                cart: {
                    items: []
                }
            })
        }

        res.status(200).json({
            success: true,
            message: "Cart fetched successfully",
            cart
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Update cart item quantity
const updateCartItemQuantity = async (req, res) => {
    try {
        const { productId } = req.params
        const { quantity } = req.body

        if (!Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be a positive integer"
            })
        }

        const product = await Product.findById(productId)
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: `Only ${product.stock} items available in stock`
            })
        }

        const cart = await Cart.findOne({ user: req.user._id })
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            })
        }

        const item = cart.items.find(i => i.product.toString() === productId)
        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not in cart"
            })
        }

        item.quantity = quantity
        await cart.save()
        await cart.populate("items.product")

        res.status(200).json({
            success: true,
            message: "Cart item quantity updated",
            cart
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params

        const cart = await Cart.findOne({ user: req.user._id })
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            })
        }

        cart.items = cart.items.filter(item => item.product.toString() !== productId)
        await cart.save()
        await cart.populate("items.product")

        res.status(200).json({
            success: true,
            message: "Product removed from cart",
            cart
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Clear all items from cart
const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id })
        if (!cart) {
            return res.status(200).json({
                success: true,
                message: "Cart is already empty",
                cart: { items: [] }
            })
        }

        cart.items = []
        await cart.save()

        res.status(200).json({
            success: true,
            message: "Cart cleared successfully",
            cart
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
    addToCart,
    getCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart
}