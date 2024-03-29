const Products = require('../models/productModel')


// Filter, Sorting and Pagination
class APIfeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }
    filtering(){
        const queryObj = { ...this.queryString }

        const excludedFields = [ 'limit', 'page', 'sort']
        excludedFields.forEach(e => delete(queryObj[e]))

        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g,match => '$' + match)

        this.query.find(JSON.parse(queryStr))
        return this;
    }
    sorting(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join('')
            console.log(sortBy)
            this.query = this.query.sort(sortBy) 
        }
        else{
            this.query = this.query.sort('-createdAt')
        }
        return this;
    }
    pagination(){
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 3
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}


const productCtrl = {
    getProducts: async(req, res) => {
        try {
            const features = new APIfeatures(Products.find(), req.query).filtering().sorting().pagination()
            const  products = await features.query
            res.json ({
                status: 'Success',
                product: products,
                result: products.length
            })
        } catch (error) {
            return res.status(500).json({msg:error.message})
        }
    },
    createProduct: async(req, res) => {
        try {
            const { product_id, title, price, description, content, images, category} = req.body;
            if(!images) return res.status(400).json({msg: "No imageupload"})

            const product = await Products.findOne({product_id})
            if(product) 
                return res.status(400).json({msg: "This product already exists"})
            
            // let product_title = title.toLowerCase()
            // const product_name = await Products.findOne({product_title})
            // console.log("wwww", product_name, product_title)
            // if(product_name)  return res.status(400).json({msg: "A product with this title exists."})

            const newProduct = new Products({
                product_id, title: title.toLowerCase(), price, description, content, images, category
            })
            await newProduct.save()
            res.json({msg: "Product Added"})
        } catch (error) {
            return res.status(500).json({msg:error.message})
        }
    },
    deleteProduct: async(req, res) => {
        try {
            await Products.findByIdAndDelete(req.params.id)
            res.json({msg: "Deleted the product"})
        } catch (error) {
            return res.status(500).json({msg:error.message})
        }
    },
    updateProduct: async(req, res) => {
        try {
            const { title, price, description, content, images, category } = req.body
            if(!images) return res.status(400).json({msg: "No imageupload"})

            await Products.findOneAndUpdate({_id: req.params.id}, {
                title: title.toLowerCase(), price, description, content, images, category
            })
            res.json({msg: "Updated the product"})
        } catch (error) {
            return res.status(500).json({msg:error.message})
        }
    }
}

module.exports = productCtrl