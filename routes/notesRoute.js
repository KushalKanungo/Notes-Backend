const express = require("express");
const Notes = require('../models/notesModel')
const router = express.Router()
const mongoose = require('mongoose')

router.get('/', async (req, res, next) => {
    const notes = await Notes.find({"user" : req.userName})
    res.json({ "notes": notes })
})

//<-----------------Create a new Notes-------------------->
router.post('/new', async (req, res, next) => {
    const notes = new Notes(req.body)
    notes.user=req.userName
    const savedNotes = await notes.save()
    res.json(savedNotes)
})

// <---------------------Find By ID--------------------------->
router.get('/get/:id', async (req, res, next) => {
    const n = await Notes.findOne({ id: req.params.id })
    if (n) {
        res.json(n)
    } else {
        res.json({ "isFound": false })
    }

})

//<---------------------Delete By ID----------------------------->
router.delete('/delete/:id', async (req, res, next) => {
    const result = await Notes.findOneAndDelete({ id: req.params.id })
    res.json({ "isDeleted": true })
})

//<---------------------Update By ID------------------------------>
router.patch('/update/:id', async (req, res, next) => {
    const q = await Notes.updateOne({ _id: req.params.id }, { $set: req.body })
    res.json(q)
})

//<-----------------------Random Notes----------------------------->
router.get('/random', async (req, res, next) => {
    const count = await Notes.countDocuments()
    const random = Math.floor(Math.random() * count)
    const q = await Notes.findOne().skip(random)
    res.json(q)

})

module.exports = router