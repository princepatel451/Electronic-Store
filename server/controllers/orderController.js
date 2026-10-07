const Order = require("../models/Order")
const { Product } = require("../models/Product")
const Cart = require("../models/Cart")
const { createSamsungFulfillmentPackage } = require("../services/samsungService")

// Create a new order
const createOrder = async (req, res) => {
    try {
        const { shippingAddress, items } = req.body

        if (!shippingAddress) {
            return res.status(400).json({
                success: false,
                message: "Shipping address is required"
            })
        }

        const { fullName, phone, addressLine, city, state, pincode } = shippingAddress
        if (!fullName || !phone || !addressLine || !city || !state || !pincode) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all shipping address fields"
            })
        }

        let orderItems = []
        let isFromCart = false

        // If items are provided in the request body, use them; otherwise, check user's cart
        if (items && Array.isArray(items) && items.length > 0) {
            orderItems = items
        } else {
            const cart = await Cart.findOne({ user: req.user._id }).populate("items.product")
            if (!cart || !cart.items || cart.items.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "No items provided and cart is empty"
                })
            }
            isFromCart = true
            orderItems = cart.items.map(item => ({
                product: item.product._id,
                quantity: item.quantity
            }))
        }

        let calculatedItems = []
        let totalAmount = 0

        // Validate stock and compute totalAmount from current DB product prices
        for (const item of orderItems) {
            const product = await Product.findById(item.product)
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product with ID ${item.product} not found`
                })
            }

            const qty = Number(item.quantity)
            if (!Number.isInteger(qty) || qty < 1) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid quantity for product ${product.name}`
                })
            }

            if (product.stock < qty) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}. Available: ${product.stock}`
                })
            }

            totalAmount += product.price * qty
            calculatedItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: qty
            })
        }

        // Create the order
        const order = await Order.create({
            user: req.user._id,
            items: calculatedItems,
            totalAmount,
            shippingAddress: {
                fullName,
                phone,
                addressLine,
                city,
                state,
                pincode
            },
            paymentStatus: "PENDING",
            orderStatus: "PENDING"
        })

        // Decrement product stock
        for (const item of calculatedItems) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity }
            })
        }

        // If order was created from cart, clear cart items
        if (isFromCart) {
            await Cart.findOneAndUpdate(
                { user: req.user._id },
                { $set: { items: [] } }
            )
        }

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Get logged-in user's orders
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate("items.product", "name price images")
            .sort({ createdAt: -1 })

        res.status(200).json({
            success: true,
            orders
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Get single order by ID
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("user", "name email")
            .populate("items.product", "name price images")

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            })
        }

        // Ensure user is owner or admin
        const isOwner = order.user._id.toString() === req.user._id.toString()
        const isAdmin = req.user.role === "ADMIN"

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to view this order"
            })
        }

        res.status(200).json({
            success: true,
            order
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Cancel order (User or Admin)
const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            })
        }

        const isOwner = order.user.toString() === req.user._id.toString()
        const isAdmin = req.user.role === "ADMIN"

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to cancel this order"
            })
        }

        if (order.orderStatus === "CANCELLED") {
            return res.status(400).json({
                success: false,
                message: "Order is already cancelled"
            })
        }

        if (order.orderStatus === "DELIVERED" || order.orderStatus === "SHIPPED") {
            return res.status(400).json({
                success: false,
                message: `Cannot cancel order that has already been ${order.orderStatus.toLowerCase()}`
            })
        }

        order.orderStatus = "CANCELLED"
        await order.save()

        // Restock products
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: item.quantity }
            })
        }

        res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            order
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Admin: Get all orders
const getAllOrders = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query
        const filter = {}

        if (status) {
            filter.orderStatus = status
        }

        const skip = (Number(page) - 1) * Number(limit)

        const orders = await Order.find(filter)
            .populate("user", "name email")
            .populate("items.product", "name price images")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))

        const totalOrders = await Order.countDocuments(filter)

        res.status(200).json({
            success: true,
            orders,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(totalOrders / Number(limit)),
                totalOrders,
                limit: Number(limit)
            }
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Admin: Update order status
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body
        const allowedStatuses = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"]

        if (!status || !allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid order status. Allowed values: ${allowedStatuses.join(", ")}`
            })
        }

        const order = await Order.findById(req.params.id)
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            })
        }

        // If transitioning to CANCELLED from an active status, restore stock
        if (status === "CANCELLED" && order.orderStatus !== "CANCELLED") {
            for (const item of order.items) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { stock: item.quantity }
                })
            }
        }

        order.orderStatus = status
        await order.save()

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order
        })
    }
    catch (error)
    {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Admin: Update payment status
const updatePaymentStatus = async (req, res) => {
    try {
        const { paymentStatus } = req.body
        const allowedStatuses = ["PENDING", "PAID", "FAILED"]

        if (!paymentStatus || !allowedStatuses.includes(paymentStatus)) {
            return res.status(400).json({
                success: false,
                message: `Invalid payment status. Allowed values: ${allowedStatuses.join(", ")}`
            })
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { paymentStatus },
            { new: true, runValidators: true }
        )

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Payment status updated successfully",
            order
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Admin: Generate 1-Click Samsung Fulfillment Package for an order
const getSamsungFulfillmentPackage = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("user", "name email")
            .populate("items.product")

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            })
        }

        const fulfillmentPackage = createSamsungFulfillmentPackage(order)

        res.status(200).json({
            success: true,
            fulfillmentPackage
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Admin: Update Samsung fulfillment status (tracking number, supplier order ID)
const updateFulfillmentStatus = async (req, res) => {
    try {
        const { status, supplierOrderId, trackingNumber, notes } = req.body

        const order = await Order.findById(req.params.id)
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            })
        }

        if (!order.fulfillment) {
            order.fulfillment = {}
        }

        if (status) order.fulfillment.status = status
        if (supplierOrderId !== undefined) order.fulfillment.supplierOrderId = supplierOrderId
        if (trackingNumber !== undefined) order.fulfillment.trackingNumber = trackingNumber
        if (notes !== undefined) order.fulfillment.notes = notes

        // If marked fulfilled on Samsung, update customer order status to SHIPPED
        if (status === "FULFILLED" && order.orderStatus !== "DELIVERED") {
            order.orderStatus = "SHIPPED"
        }

        await order.save()

        res.status(200).json({
            success: true,
            message: "Fulfillment updated successfully",
            order
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    getAllOrders,
    updateOrderStatus,
    updatePaymentStatus,
    getSamsungFulfillmentPackage,
    updateFulfillmentStatus
}
