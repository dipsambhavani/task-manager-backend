const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

const User = require("../model/user.model");

const jwtSecret = "skdnguidfg";

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email'],
    });
    res.status(200).json({
      users: users,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postSignup = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed!!!");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const hashedPw = await bcrypt.hash(password, 12);
    const user = User.build({
      email: email,
      password: hashedPw,
    });
    const result = await user.save();
    const token = jwt.sign(
      {
        id: result.id,
        email: email,
      },
      jwtSecret,
      { expiresIn: "1d" }
    );
    await res.status(200).json({
      message: "Signed up !!!",
      accessToken: token,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      const error = new Error("user not found !!!");
      error.statusCode = 403;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      return res.status(403).json({
        message: "Wrong Password!!!",
      });
    }
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      jwtSecret,
      { expiresIn: "1d" }
    );
    await res.status(200).json({
      message: "ok",
      accessToken: token,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
