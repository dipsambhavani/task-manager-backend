const express = require("express");

const authController = require('../controller/auth');

const router = express.Router();

router.post('/signup', authController.postSignup);

router.post('/login', authController.postLogin);

exports.router = router;