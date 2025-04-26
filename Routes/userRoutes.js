const authController = require("./../Controllers/authController");
const userController = require("./../Controllers/userController");
const express = require("express");

const router = express.Router(); //returns a middleware

//Authentication routes
router.post("/signUp", authController.signUp);
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.post("/resetPassword/:token", authController.resetPassword);
router.patch(
  "/updatePassword",
  authController.protect,
  authController.updatePassword
);

//User routers
router.get("/", userController.getAllUsers);

module.exports = router;
