const router = require('express').Router()
const Transaction = require('../model/Transaction')
const Product = require('../model/Product')

router.get('/', async (req, res)=> {
    try {
        const stat = await Transaction.aggregate([
            {
              $facet: {
                totalSales: [
                  {
                    $match: {
                      type: "sale",
                    },
                  },
                  {
                    $group: {
                      _id: "$type",
                      total: {
                        $sum: "$amount",
                      },
                    },
                  },
                ],
                totalPurchase: [
                  {
                    $match: {
                      type: "purchase",
                    },
                  },
                  {
                    $group: {
                      _id: "$type",
                      total: {
                        $sum: "$amount",
                      },
                    },
                  },
                ],
              },
            },
          ])

        const totalInventoryRaw = await Transaction.aggregate([
            {
              $facet: {
                salesQty: [
                  {
                    $match: {
                      type: "sale",
                    },
                  },
                  {
                    $group: {
                      _id: null,
                      total: {
                        $sum: "$qty",
                      },
                    },
                  },
                ],
                purchaseQty: [
                  {
                    $match: {
                      type: "purchase",
                    },
                  },
                  {
                    $group: {
                      _id: null,
                      total: {
                        $sum: "$qty",
                      },
                    },
                  },
                ],
              },
            },
          ])

          const totalInventory = totalInventoryRaw[0]?.purchaseQty[0]?.total - totalInventoryRaw[0]?.salesQty[0]?.total || 0

          res.status(200).json({stat, totalInventory})
    } catch (error) { 
        console.log(error)
    } 
})


router.get('/product-qty', async (req, res)=> {
  try {
    const salesQty = await Transaction.aggregate([
      {
        $match: {
          type: "sale",
        },
      },
      {
        $group: {
          _id: "$product_id",
          saleQty: {
            $sum: "$qty",
          },
        },
      },
    ])

    const purchaseQty = await Transaction.aggregate([
      {
        $match: {
          type: "purchase",
        },
      },
      {
        $group: {
          _id: "$product_id",
          purchaseQty: {
            $sum: "$qty",
          },
        },
      },
    ])

    const newArr = []
   
    for(let i = 0; i < purchaseQty.length; i++) {
      const purId = purchaseQty[i]._id

      for(let e = 0; e < salesQty.length; e++) {
        if( purId.toString() == salesQty[e]._id.toString()) {
          newArr.push({
            _id: purchaseQty[i]._id,
            remainingQty: purchaseQty[i].purchaseQty - salesQty[e].saleQty
          })
        }
      }
    }

    await Product.populate(newArr, {
      path: '_id',
      select: {
        _id: 0,
        product_name: 1
      }
    })


    res.status(200).json(newArr)
  } catch (error) {
    console.log(error)
  }
})

module.exports = router