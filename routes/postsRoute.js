const router = require('express').Router()
const checkAuth=require('../auth/checkAuth')

router.get('/private',checkAuth, (req,res,send)=>{
    res.send(` Your Email ID is ${req.user}, You are Authorized`)
})

router.get('/public', (req,res,send)=>{
    res.send(` You Can see this it is public`)
})

module.exports=router