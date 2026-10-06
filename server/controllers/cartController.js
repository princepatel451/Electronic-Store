const Cart = require("../models/Cart")
const { Product } = require("../models/Product")
const User = require("../models/User")

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

        let cart = await Cart.findOne({ user: req.user._id });

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
        }
        else {
            const existingItem = cart.items.find(
                item => item.product.toString() == productId
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
            }
            else {
                cart.items.push({ product: productId, quantity });
            }
        }

        await cart.save()
        await cart.populate("items.product");
        res.status(200).json({
            success: true,
            message: "Product added to cart",
            cart
        });


    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

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
            });
        }

        res.status(200).json({
            success: true, 
            message: "Cart fetched successfully", 
            cart 
        });
    }
    catch (error) {
        res.status(500).json({
            success: false, 
            message: error.message 
        });
    }
}

module.exports = { addToCart, getCart };