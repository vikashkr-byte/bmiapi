const mongoose = require('mongoose')

let userSchema = new mongoose.Schema({
    username: {
        type: String, required: true
    },
    email: {
        type: String, required: true
    },
    password: {
        type: String,
    }
})

module.exports = mongoose.model("user", userSchema)