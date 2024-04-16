const express = require("express");

const { body } = require("express-validator");

const authController = require("../controller/auth");

const User = require("../model/user");

const router = express.Router();

router.get('/users', authController.getUsers);

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter the valid email.")
      .custom((value, { req }) => {
        return User.findOne({ where: { email: req.body.email } }).then(
          (userDoc) => {
            if (userDoc) {
              return Promise.reject("Email already being used!!!");
            }
          }
        );
      })
      .normalizeEmail(),
    body("password")
      .trim()
      .isString()
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i")
      .withMessage(
        "Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 20 char long"
      ),
  ],
  authController.postSignup
);

router.post("/login", authController.postLogin);

exports.router = router;
