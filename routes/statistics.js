const router = require("express").Router();
const Transaction = require("../model/Transaction");
const Product = require("../model/Product");

router.get("/", async (req, res) => {
  try {
    const totalSales = await Transaction.aggregate([
      {
        $match: {
          type: "sale",
        },
      },
      {
        $project: {
          verifyAmount: {
            $ifNull: ['$amount', 0]
          }
        }
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$verifyAmount",
          },
        },
      },
    ]);

    const totalPurchase = await Transaction.aggregate([
      {
        $match: {
          type: "purchase",
        },
      },
      {
        $project: {
          verifyAmount: {
            $ifNull: ['$amount', 0]
          }
        }
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$verifyAmount",
          },
        },
      },
    ]);

    const totalInventory = await Transaction.aggregate([
      {
        $project: {
          saleQty: {
            $cond: [
              {
                $eq: ["$type", "sale"],
              },
              "$qty",
              0,
            ],
          },
          purchaseQty: {
            $cond: [
              {
                $eq: ["$type", "purchase"],
              },
              "$qty",
              0,
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalPurchaseQty: {
            $sum: "$purchaseQty",
          },
          totalSaleQty: {
            $sum: "$saleQty",
          },
        },
      },
      {
        $addFields: {
          remaining: {
            $subtract: ["$totalPurchaseQty", "$totalSaleQty"],
          },
        },
      },
      {
        $project: {
          remaining: 1,
        },
      },
    ]);

    res.status(200).json({
      totalSales: totalSales.length === 0 ? 0 : totalSales[0].total,
      totalPurchase: totalPurchase.length === 0 ? 0 : totalPurchase[0].total,
      inventoryQty: totalInventory.length === 0 ? 0 : totalInventory[0].remaining,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/prod-qty", async (req, res) => {
  try {
    const result = await Transaction.aggregate([
      {
        $project: {
          _id: 0,
          product_id: 1,
          salesQty: {
            $cond: [
              {
                $eq: ["$type", "sale"],
              },
              "$qty",
              0,
            ],
          },
          purchaseQty: {
            $cond: [
              {
                $eq: ["$type", "purchase"],
              },
              "$qty",
              0,
            ],
          },
        },
      },
      {
        $group: {
          _id: "$product_id",
          totalSalesQty: {
            $sum: "$salesQty",
          },
          totalPurchaseQty: {
            $sum: "$purchaseQty",
          },
        },
      },
      {
        $addFields: {
          remaining: {
            $subtract: ["$totalPurchaseQty", "$totalSalesQty"],
          },
        },
      },
    ]);

    await Product.populate(result, {
      path: "_id",
      select: {
        _id: 0,
        product_name: 1,
      },
    });

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
