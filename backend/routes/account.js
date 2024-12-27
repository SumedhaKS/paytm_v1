const express = require("express");
const { authMiddleware } = require("../middleware/middleware");
const { Account } = require("../db");
const { default: mongoose } = require("mongoose");
const router = express.Router()

router.get('/balance', authMiddleware , async (req,res)=>{
    const account = await Account.findOne({
        userID: req.userID
    })
    res.status(200).json({
        balance : account.balance
    })
})

router.post('/transfer', authMiddleware, async (req,res)=>{
    const session = await mongoose.startSession()
    session.startTransaction()
    const { to , amount } = req.body;
    const account = await Account.findOne({userID:req.userID}).session(session);

    if(!account || account.balance < amount){
        await session.abortTransaction()
        return res.status(400).json({
            message : "Insufficient balance"
        })
    }

    const toAccount = await Account.findOne({userID:to}).session(session);

    if(!toAccount){
        await session.abortTransaction()
        return res.status(400).json({
            message : "Invalid account"
        })
    }

    await Account.updateOne({userID:req.userID}, {$inc:{balance:-amount}}).session(session)
    await Account.updateOne({userID:to}, {$inc:{balance: amount}}).session(session)

    await session.commitTransaction()
    return res.status(200).json({
        message : "Transfer successful"
    })

})








module.exports = router;