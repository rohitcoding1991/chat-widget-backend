const {body} = require("express-validator")
const User = require("../models/users")

const signUp = () => {
    return[
        body("name").notEmpty().withMessage("name is required"),
        body("email").notEmpty().isEmail().withMessage("email is required and rigth format").custom(async(email)=>{
         let user = await User.findOne({email,status:1})
         if(user){
            throw Error ("user already exist with this email")
         }
         return email
        }),
        body("password").notEmpty().withMessage("password is required and rigth format"),
    ]
}

const login = () => {
    return [
    body("email").notEmpty().isEmail().withMessage("email is required").custom(async(email)=>{
        let user = await User.findOne({email,status:1})
        if(!user){
            throw Error("user not exist")
        }
        return email
    }),
    body("password").notEmpty().withMessage("password is required")
    ]
}
module.exports = {
    signUp,
    login
}