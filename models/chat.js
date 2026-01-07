const mongoose = require("mongoose")

const chat = mongoose.Schema({
    sender:{
type:String
    },
    receiver:{
type:String
    },
    msg:{
        type:String
    },
    msgRead:{
        type:Number
    }
},{timestamps:true})

module.exports = mongoose.model("chat",chat)