const router = require('express').Router()
const JWT = require('jsonwebtoken')
const Users = require('../models/userModel')
const bcrypt = require('bcrypt')

require('dotenv').config();


router.post('/register', async (req, res, next) => {
    const { email, password } = req.body
    if (email && password) {

        let isExist = await Users.findOne({ email: email })
        if (isExist) {
            res.status(403).json({ "message": "User Already Exist", "isRegistered": false })

        } else {

            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash(password, salt)
            const newUser = new Users({
                email: email,
                hash: hash
            })

            
            await newUser.save()
            res.json({ 'isRegistered': true })
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
            res.status(400).json({ "message": "User not Registered" })
        } else {
            const match = await bcrypt.compare(password, User.hash);
            if (match) {

                const token = await JWT.sign({
                    "email": email,
                    "id": User._id
                }, process.env.JWTSECRETKEY, {
                    expiresIn: 36000000
                })

                const user = {
                    "token": token,
                    "email": User.email
                }

                res.json({ "user": user })

            }
            else {
                res.status(400).json({ 'message': 'Wrong Password' })
            }

        }
    } else {
        res.status(400).send("Bad Request")
    }

})

module.exports = router