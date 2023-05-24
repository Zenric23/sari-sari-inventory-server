const Transaction = require('../model/Transaction')
const router = require('express').Router()


router.get('/', async (req, res)=> {
    try {
        const transactions =  await Transaction.find().populate({
            path: 'product_id',
            select: {
                product_name: 1
            }
        })
        res.status(200).json(transactions)
    } catch (error) {
        console.log(error)
    }
})


router.post('/', async (req, res)=> {
    const transDetails = req.body
    try {
        const transaction  = await new Transaction({
            ...transDetails,
            amount: transDetails.price * transDetails.qty 
            
        }).save()
        res.status(200).json(transaction)
    } catch (error) {   
        console.log(error)
    }
})


router.put('/:id', async (req, res)=> {
    try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true } 
        )
        res.status(200).json(updatedTransaction)
    } catch (error) {
        console.log(error)
    }
})


router.delete('/:id', async (req, res)=> {
    try {
        await Transaction.findByIdAndDelete(req.params.id)
        res.status(200).json('transaction deleted.')
    } catch (error) {
        console.log(error)
    }
})

module.exports = router