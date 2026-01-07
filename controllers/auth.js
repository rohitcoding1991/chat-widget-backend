const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res) => {
  let { name, email, password, otp } = req.body;
  let user = await User.findOne({ email, status: 0 });
  let currentTime = new Date();
  try {
    if (!otp) {
      let OTP = "1234";
      let [hashedOtp, hashPassword] = await Promise.all([
        bcrypt.hash(OTP, 10),
        bcrypt.hash(password, 10),
      ]);
      currentTime.setMinutes(currentTime.getMinutes() + 1);
      user = {
        name,
        email,
        password: hashPassword,
        otp: hashedOtp,
        otpExp: currentTime,
      };
      await User.findOneAndUpdate({ email: email, status: 1 }, user, {
        upsert: true,
        new: true,
      });
      res.status(200).send({
        status: "success",
        statusCode: 200,
        message: "otp send",
        data: "1234",
      });
    } else {
      let otpCheck = await bcrypt.compare(otp, user.otp);
      if (!otpCheck || currentTime > user.otpExp) {
        let msg = !otpCheck ? "otp is invalid" : "otp time expire";
        return res.status(400).send({
          status: "failed",
          statusCode: 400,
          message: msg,
          data: [],
        });
      }
      user.status = 1;
      user.otp = undefined;
      await user.save();
      res.status(200).send({
        status: "success",
        statusCode: 200,
        message: "user rigster successfully",
        data: [],
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).send({
      status: "failed",
      statusCode: 400,
      message: err.message,
      data: [],
    });
  }
};

exports.login = async (req, res) => {
  let { email, password } = req.body;
  let user = await User.findOne({ email, status: 1 });
  try {
    let passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      return res.status(400).send({
        status: "failed",
        statusCode: 400,
        message: "invalid email password",
        data: [],
      });
    }
    let userData = {
      userId: user._id,
      name: user.name,
      email: user.email,
    };
    const token = jwt.sign(userData, process.env.JWTKEY);
    res.status(200).send({
      status: "success",
      statusCode: 200,
      message: "user login",
      data: {
        accessToken: token,
        userId: user._id,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      status: "failed",
      statusCode: 400,
      message: err.message,
      data: [],
    });
  }
};

// exports.getData = async(req,res)=>{
//     let {id} = req.body
//     try{
// let user = await User.findOne({_id:id})
// res.status(200).send({
//     data:user
// })
//     }
//     catch(err){
//         console.log({err});

// res.status(400).send({
//     msg:err.message
// })
//     }
// }
