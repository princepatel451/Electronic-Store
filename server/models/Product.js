const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    brand: { type: String, required: true, trim: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    images: { type: [String], default: [] },
    rating: { type: Number, min: 0, default: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    supplier: {
        source: { type: String, default: "MANUAL" },
        originalUrl: { type: String, default: "" },
        modelCode: { type: String, default: "" },
        originalPrice: { type: Number, default: 0 },
        lastSyncedAt: { type: Date }
    }
},
    { timestamps: true }
)

const Product = mongoose.model("Product", productSchema)

module.exports = { Product }