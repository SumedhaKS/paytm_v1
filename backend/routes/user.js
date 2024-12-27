const express = require("express")
const { User } = require('../db/index')
const zod = require('zod')
const { jwt, jwtSecret } = require("../config")
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
                message: "User already exists"
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
    if(userData.success){
        const user = await User.findOne({
            username: userData.username,
            password: userData.password
        })
        if(!user){
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
        message : "Incorrect inputs"
    }) 
})



module.exports = router;
