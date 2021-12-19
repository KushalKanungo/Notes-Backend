const express = require("express");
const Users = require('../models/userModel')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


router.post('/register', async (req, res, next) => {
    const { email, password } = req.body
    if (email && password) {

        let isExist = await Users.findOne({ email: email })
        if (isExist) {
            res.status(403).json({ 'isRegistered': false, 'alreadyExist': true })
        } else {

            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash(password, salt)
            const newUser = new Users({
                email: email,
                hash: hash
            })

            await newUser.save()
            res.json({ 'isRegistered': true, 'alreadyExist': false })
        }
    }
    else {
        res.status(400).send("Bad Request")
    }
})


router.post('/login', async (req, res, next) => {

    const { email, password } = req.body
    if (email && password) {

        let User = await Users.findOne({ email: email })
        if (!User) {
            res.send('User Not Exist Please Login')
        } else {
            const match = await bcrypt.compare(password, User.hash);
            if (match) {
                req.session.isAuth = true
                res.json('Logged In Successfully')
            }
            else {
                res.send('Wrong Password')
            }

        }
    } else {
        res.status(404).send("Bad Request")
    }

})



module.exports = router