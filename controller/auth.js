const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

const User = require("../model/user");

const jwtSecret = "skdnguidfg";

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
    await res.json({
      message: "Signed up !!!",
      statusCode: 200,
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
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      const error = new Error("user not found !!!");
      error.statusCode = 403;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      return res.json({
        message: "Wrong Password!!!",
        statusCode: 403,
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
    await res.json({
      message: "ok",
      statusCode: 200,
      accessToken: token,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
