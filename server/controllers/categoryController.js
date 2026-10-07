const { Category } = require("../models/Category")

const createCategory = async(req, res) => {
    const {name, description, image} = req.body

    try{
        const category = await Category.create({name, description, image})

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            category
        })
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getCategory = async(req, res) => {
    try{
        const category = await Category.find()

        if(!category){
            return res.status(404).json({
                success: false,
                message: "Category not found"
            })
        }

        res.status(200).json({
            success: true,
            category
        })
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getCategoryById = async(req, res) => {
    try{
        const category = await Category.findById(req.params.id)

        if(!category){
            return res.status(404).json({
                success: false,
                message: "Category not found"
            })
        }

        res.status(200).json({
            success: true,
            category
        })
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const updateCategory = async(req, res) => {
    try{
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

        if(!category){
            return res.status(404).json({
                success: false,
                message: "Category not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category
        })
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const deleteCategory = async(req, res) => {
    try{

        const category = await Category.findByIdAndDelete(req.params.id)
        
        if(!category){
            return res.status(404).json({
                success: false,
                message: "Category not found"
            })
        }
        
        res.status(200).json({
            success: true,
            message: "Category deleted successfully"
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
    createCategory,
    getCategory,
    getCategoryById,
    updateCategory,
    deleteCategory
}