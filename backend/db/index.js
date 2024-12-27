const mongoose = require("mongoose")

mongoose.connect("")        // your mongoose url here

const UserSchema = new mongoose.Schema({
    username : String,
    password : String,
    firstName : String,
    lastName : String
})

const AccountSchema = new mongoose.Schema({
    userID : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'UserSchema',
        required : true
    },
    balance : {
        type : Number,
        required : true
    }
})

const User = mongoose.model("User", UserSchema)
const Account = mongoose.model("Account", AccountSchema)
module.exports = {
    User,
    Account
}

