const router = require('express').Router()
const Product = require('../model/Product')
const Transaction = require('../model/Transaction')


router.get('/', async (req, res)=> {
    try {
        const products =  await Product.find()
        res.status(200).json(products)
    } catch (error) {
        console.log(error)
    }
})


router.post('/', async (req, res)=> {
    try {
        const isProdNameExist = await Product.findOne({product_name: req.body.product_name})
        if(isProdNameExist) return res.status(403).json('Product name is already exist.')
        const product = new Product(req.body)
        await product.save()
        res.status(200).json(product)
    } catch (error) {
        console.log(error)
    }
}) 


router.put('/:id', async (req, res)=> {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true } 
        )
        res.status(200).json(updatedProduct) 
    } catch (error) {
        console.log(error)
    }
})


router.delete('/:id', async (req, res)=> {
    try {
        await Product.findByIdAndDelete(req.params.id)
        await Transaction.deleteMany({product_id: req.params.id})
        res.status(200).json('product deleted.')
    } catch (error) {
        console.log(error)
    }
})

module.exports = router