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
        const products = await Product.find().populate("category")
        res.status(200).json({
            success: true,
            products
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