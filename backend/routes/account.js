const express = require("express");
const { authMiddleware } = require("../middleware/middleware");
const { Account } = require("../db");
const router = express.Router()

router.get('/balance', authMiddleware , async (req,res)=>{
    const account = await Account.findOne({
        userID: req.userID
    })
    res.status(200).json({
        balance : account.balance
    })
})

router.post('/transfer', authMiddleware, (req,res)=>{
    // yet to implement
})








module.exports = router;