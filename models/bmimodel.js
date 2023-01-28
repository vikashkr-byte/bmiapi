const mongoose = require('mongoose')

let bmiSchema = new mongoose.Schema({
    bmi: {
        type: String, required: true
    },
    result: {
        type: String, required: true
    }
})

module.exports = mongoose.model("bmi", bmiSchema)