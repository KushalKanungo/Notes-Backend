const JWT = require('jsonwebtoken')
const Users = require('../models/userModel')

require('dotenv').config();

module.exports = async (req, res, next) => {
    const token = req.header("x-auth-token")

    if (!token) {
        return res.status(400).json({
            "errors": {
                "msg": "No Token Found"
            }
        })
    }

    try {
        let tokenUser = await JWT.verify(token, process.env.JWTSECRETKEY)
        let existUser = Users.findOne({ "email": tokenUser.email, "_id": tokenUser.id })
        if (existUser) {
            req.userName = tokenUser.email
            req.id = tokenUser.id
            next()
        }
        else {
            res.status(400).json({
                "msg": "Token Invalid"
            })
        }


    } catch (error) {
        return res.status(400).json({
            "msg": "Token Invalid"
        })

    }

}