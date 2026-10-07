const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },
                name: {
                    type: String,
                    required: true
                },
                price: {
                    type: Number,
                    required: true,
                    min: 0
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                }
            }
        ],

        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },

        shippingAddress: {
            fullName: {
                type: String,
                required: true,
                trim: true
            },
            phone: {
                type: String,
                required: true,
                trim: true
            },
            addressLine: {
                type: String,
                required: true,
                trim: true
            },
            city: {
                type: String,
                required: true,
                trim: true
            },
            state: {
                type: String,
                required: true,
                trim: true
            },
            pincode: {
                type: String,
                required: true,
                trim: true
            }
        },

        paymentStatus: {
            type: String,
            enum: ["PENDING", "PAID", "FAILED"],
            default: "PENDING"
        },

        orderStatus: {
            type: String,
            enum: ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"],
            default: "PENDING"
        },

        fulfillment: {
            status: {
                type: String,
                enum: ["UNFULFILLED", "IN_PROGRESS", "FULFILLED", "FAILED"],
                default: "UNFULFILLED"
            },
            supplier: {
                type: String,
                default: "SAMSUNG"
            },
            supplierOrderId: {
                type: String,
                default: ""
            },
            trackingNumber: {
                type: String,
                default: ""
            },
            checkoutUrl: {
                type: String,
                default: ""
            },
            notes: {
                type: String,
                default: ""
            }
        }
    },
    { timestamps: true }
)

const Order = mongoose.model("Order", orderSchema)

module.exports = Order
