const jwt = require("jsonwebtoken")
const User = require("../models/users")


async function verifyToken(req,res,next){
let token = req.header("Authorization")
token = token.split(" ")[1]
if(!token){
    return res.status(401).send({
        status:"failed",
        statusCode:401,
        message:"a token is required",
        data:[]
    })
}
try{
    console.log({token});
    const decoded = jwt.verify(token, process.env.JWTKEY);
    let user = await User.findOne({_id:decoded.userId})
    if(!user){
        return res.status(401).send({
            status:"failed",
            statusCode:401,
            message:"user not found",
            data:[]
        })
    }
    req.user = {userId:decoded.userId}
    next()
}
catch(err){
return res.status(401).send({
    status:"failed",
    statusCode:401,
    message:err.message,
    data:[]
})
}
}

module.exports = {
    verifyToken
}