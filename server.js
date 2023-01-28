const express = require("express")
const connection = require("./db")
const dotenv = require('dotenv').config()

let User = require('./models/usermodel')
let BMI = require("./models/bmimodel")

const app = express()



app.use(express.json())

app.get('/', (req, res) => {
    res.send("hello")
})
app.post('/register', async (req, res) => {
    let payload = req.body
    // console.log('payload:', payload)
    let ifUserExists = await User.findOne({ username: payload.username })
    if (ifUserExists) {
        res.send('User already registered. login')
    } else {
        try {
            let user = new User(payload)
            await user.save()
            res.send(payload)

        } catch (error) {
            res.send(error)
        }
    }
})
app.post('/login', async (req, res) => {
    let payload = req.body
    console.log('payload:', payload)
    let ifUserExists = await User.findOne({ username: payload.username })

    // console.log('ifUserExists:', ifUserExists)
    try {
        if (ifUserExists) {
            let username = payload.username
            let password = payload.password
            if (username == ifUserExists.username && password == ifUserExists.password) {
                res.send("user logged in successfully")
            } else {
                res.send("wrong credentials..")
            }
        }

        res.send(ifUserExists)

    } catch (error) {
        res.send(error)
    }
})

app.post('/calculateBMI', async (req, res) => {
    let payload = req.body
    let height = Number(payload.height)
    height = height * 0.3048
    height = height * height
    let weight = Number(payload.weight)
    // console.log('payload:', height, weight)
    let bmi = calculate_BMI(weight, height)
    // console.log('bmi:', bmi)
    function calculate_BMI(weight, height) {
        let BMI = (weight / height)
        return BMI
    }
    bmi = bmi.toFixed(2).toString()
    let result
    if (bmi < 18.5) {
        result = "Underweight"
    } else if (bmi >= 18.5 && bmi <= 24.9) {
        result = "Normal Weight"
    } else if (bmi >= 30 && bmi <= 34.9) {
        result = "Obesity"
    } else if (bmi >= 25 && bmi <= 29.9) {
        result = "Over Weight"
    } else if (bmi >= 35 && bmi <= 39.9) {
        result = "Extreme Obesity"
    }

    let newResult = {
        bmi: bmi,
        result: result
    }
    try {
        let BmiData = new BMI(newResult)
        await BmiData.save()
        res.send(BmiData)
    } catch (error) {
        console.log('error:', error)
    }
})

app.listen(8080, async () => {
    try {
        await connection
        console.log("connected to database")
    } catch (error) {
        console.log('error:', error)
    }
    console.log(`listen to http://localhost:${8080}`)
})