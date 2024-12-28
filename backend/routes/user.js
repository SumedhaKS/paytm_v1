const express = require("express")
const { User, Account } = require('../db/index')
const zod = require('zod')
const { jwt, jwtSecret } = require("../config")
const { authMiddleware } = require("../middleware/middleware")
const router = express.Router()

const signUpSchema = zod.object({
    username: zod.string().email(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string(),
})

router.post('/signup', async (req, res) => {
    const userBody = req.body;

    const validateUser = signUpSchema.safeParse(userBody)
    console.log(validateUser)
    if (validateUser.success) {
        const response = await User.findOne({
            username: userBody.username,
        })

        if (response) {
            return res.json({
                message: "Email already taken / Incorrect inputs"
            })
        }
        const newUser = await User.create({
            username: userBody.username,
            password: userBody.password,
            firstName: userBody.firstName,
            lastName: userBody.lastName
        })
        const userID = newUser._id   
        const Token = jwt.sign({userID}, jwtSecret) 

        // generating random balance
        await Account.create({
            userID,
            balance: 1 + Math.random() * 10000
        })
        return res.status(200).json({                                                               
            message: "User created successfully",
            token: Token
        })
    }
    else {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

})

const signInSchema = zod.object({
    username: zod.string().email(),
    password: zod.string()
})

router.post('/signin', async (req, res) => {
    const userData = signInSchema.safeParse(req.body);
    if (userData.success) {
        const user = await User.findOne({
            username: userData.username,
            password: userData.password
        })
        if (!user) {
            return res.status(411).json({
                message: "Error while logging in"
            })
        }

        const Token = jwt.sign({
            userID: user._id
        }, jwtSecret)

        return res.json({
            token: Token
        })
    }
    return res.status(411).json({
        message: "Incorrect inputs"
    })
})

const updateUserSchema = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional()
})

router.put('/', authMiddleware, async (req, res) => {
    const userData = updateUserSchema.safeParse(req.body);
    if (!userData.success) {
        return res.status(411).json({
            message: "Error while updating information"
        })
    }
    await User.updateOne({ _id: req.userID }, req.body)
    return res.status(200).json({
        message: "Updated successfully"
    })
})

router.get('/bulk', authMiddleware, async (req, res) => {
    const filter = req.query.filter || "";
    const allUsers = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            },
            lastName: {
                "$regex": filter
            }
        }]
    })
    res.status(200).json({
        users: allUsers.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })

})

module.exports = router;
