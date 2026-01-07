const mongoose = require("mongoose")
let users=  mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    otp:{
        type:String
    },
    otpExp:{
        type:Date
    },
    status:{
        type:Number,
        default:0
    }
},{timestamps:true})

module.exports = mongoose.model("user",users)