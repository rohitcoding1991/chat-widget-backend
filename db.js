const mongoose = require("mongoose")

mongoose.connect(process.env.MONGODB).then(()=>{
    console.log("db connected");
}).catch(()=>{
    console.log("an error occur while db connection");
})

let db = mongoose.connection
module.exports = db