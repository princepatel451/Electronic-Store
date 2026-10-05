const express = require("express")
const { Product } = require("../models/Product")

const createProduct = async(req, res) => {
    const {
        name,
        description,
        price,
        category,
        brand,
        stock,
        images,
    } = req.body

    try{
        const product = await Product.create({
                        name,
                        description,
                        price,
                        category,
                        brand,
                        stock,
                        images,
                        })
        
        res.status(201).json({
            success: true,
            message: " Product Added Successfully"
        })
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getProducts = async(req, res) => {
    
    try{
        const {
            search, 
            category,
            brand, 
            minPrice,
            maxPrice,
            page = 1,
            limit = 10,
        } = req.query
        
        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        
        if (!Number.isInteger(pageNumber) ||
            pageNumber < 1
        ) {
            return res.status(400).json({
                success: false,
                message: "Page must be a positive integer"
            });
        }

        if (
            !Number.isInteger(limitNumber) ||
            limitNumber < 1 ||
            limitNumber > 50
        ) {
            return res.status(400).json({
                success: false,
                message: "Limit must be between 1 and 50"
            });
        }

        if (
            minPrice !== undefined &&
            (isNaN(Number(minPrice)) || Number(minPrice) < 0)
        ) {
            return res.status(400).json({
                success: false,
                message: "minPrice must be a valid non-negative number"
            });
        }

        if (
            maxPrice !== undefined &&
            (isNaN(Number(maxPrice)) || Number(maxPrice) < 0)
        ) {
            return res.status(400).json({
                success: false,
                message: "maxPrice must be a valid non-negative number"
            });
        }

        if (
            minPrice !== undefined &&
            maxPrice !== undefined &&
            Number(minPrice) > Number(maxPrice)
        ) {
            return res.status(400).json({
                success: false,
                message: "minPrice cannot be greater than maxPrice"
            });
        }

        if (
            category &&
            !mongoose.Types.ObjectId.isValid(category)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid category ID"
            });
        }
        const filter = {}

        if(search){
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { brand: { $regex: search, $options: "i" } }
            ]
        }

        if(category){
            filter.category = category
        }

        if(brand){
            filter.brand = {$regex: brand, $options: "i"}
        }

        if(minPrice || maxPrice){
            filter.price = {}

            if(minPrice){
                filter.price.$gte = Number(minPrice)
            }
            if(maxPrice){
                filter.price.$lte = Number(maxPrice)
            }
        }

        let sortOption = {}

        if(sort == "price_asc"){
            sortOption.price = 1
        }
        else if(sort == "price_desc"){
            sortOption.price = -1
        }
        else if(sort == "rating"){
            sortOption.rating = -1
        }
        else{
            sortOption.createdAt = -1;
        }

        const skip = (Number(page) - 1) * Number(limit)

        const products = await Product
                               .find(filter)
                               .populate("category")
                               .sort(sortOption)
                               .skip(skip)
                               .limit(Number(limit))

        const totalProducts = await Product.countDocuments(filter)
        
        res.status(200).json({
            success: true,
            products,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(totalProducts / Number(limit)),
                totalProducts,
                limit: Number(limit)
            }
        })
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getProductById = async(req, res) => {
    
    try{
        const product = await Product.findById(req.params.id).populate("category")
        if(!product){
            return res.status(404).json({
                success: false,
                message: "Product Not Found"
            })
        }
        
        res.status(200).json({
            success: true,
            product
        })
    }

    catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const updateProduct = async(req, res) => {
    try{
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true, runValidators: true}
        ).populate("category")
        
        if(!product){
            return res.status(404).json({
                success: false,
                message: "Product Not Found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Product Updated Successfully",
            product
        })
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const deleteProduct = async(req, res) => {
    try{
        const product = await Product.findByIdAndDelete(req.params.id)

        if(!product){
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        })
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }

}

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};