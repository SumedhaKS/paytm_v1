const mongoose = require("mongoose")

mongoose.connect("")        // your mongoose url here

const UserSchema = new mongoose.Schema({
    username : String,
    password : String,
    firstName : String,
    lastName : String
})

const User = mongoose.model("User", UserSchema)

module.exports = {
    User
}

