const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const chatController = require("../controllers/chat");
const { verifyToken } = require("../validationMiddleWare/tokenValidation");
const { signUp, login } = require("../validationMiddleWare/commonValidation");
const { validationCheck } = require("../validationMiddleWare/validationResult");

router.post("/signUp", signUp(), validationCheck, authController.signUp);
router.post("/login", login(), validationCheck, authController.login);

// router.get("/login",authController.getData)

// verify token middleWare pending
router.get("/chat", verifyToken, chatController.chatMessages);
router.get("/chatList", verifyToken, chatController.chatList);

module.exports = router;
