const mongoose=require('mongoose')

const NotesSchema=new mongoose.Schema({
    title:String,
   content: String,
   id:String
})

module.exports=mongoose.model('Notes', NotesSchema)