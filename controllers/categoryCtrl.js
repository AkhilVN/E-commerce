const Category = require('../models/categoryModel')

const categoryCtrl = {
    getCategories: async(req,res) => {
        try {
            const categories = await Category.find()
            res.json(categories)
        } catch (err) {
            return res.status(500).json({msg:err.message})
        }
    },
    createCategory: async (req,res) => {
        try {
            // Only admin can create, delete and update category
            const { name } = req.body
            const category = await Category.findOne({name})
            if(category) return res.status(400).json({msg:"This category already exists"})

            const newCategory = new Category({name})
            await newCategory.save()
            res.json({msg:'Created a category'})
        } catch (err) {
            return res.json(500).json({msg:err.message})
        }
    },
    deleteCategory: async (req,res) => {
        try {
            const { id } = req.params
            const category = await Category.findByIdAndDelete(id)
            if(!category) return res.status(400).json({msg:'Category doesnt exist'})

            res.json({msg:'Category Deleted'})
        } catch (err) {
            return res.status(500).json({msg:err.message})
        }
    },
    updateCategory: async (req,res) => {
        try {
            const { id } = req.params
            const { name } = req.body
            const categoryName = await Category.findOne({name})
            console.log("ccc",categoryName)
            if(categoryName) return res.status(400).json({msg: 'Category exist already'})
            const category = await Category.findByIdAndUpdate({_id: id}, {name})
            if(!category) return res.status(400).json({msg:'Category doesnt exist'})
            res.json({msg:'updated a category'})
        } catch (err) {
            return res.status(500).json({msg:err.message})
        }
    },
}

module.exports = categoryCtrl