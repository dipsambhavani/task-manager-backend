const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../model/user");

const jwtSecret = "skdnguidfg";

exports.postSignup = (req, res, next) => {
  /**
   * User validation & creation logic after that use created user's id & email below.
   */

  console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;
  bcrypt
    .hash(password, 12)
    .then((hashedPw) => {
      console.log(hashedPw);
      const user = User.build({
        email: email,
        password: hashedPw,
      });
      return user.save();
    })
    .then((result) => {
      console.log("Signed up !!!");
      const token = jwt.sign(
        {
          id: result.id,
          email: email,
        },
        jwtSecret,
        { expiresIn: "1d" }
      );

      return res.json({
        message: "Signed up !!!",
        statusCode: 200,
        accessToken: token,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ where: { email: email } })
    .then((user) => {
      if (!user) {
        const error = new Error("user not found !!!");
        error.statusCode = 403;
        throw error;
      }
      console.log("user found :", user);
      bcrypt
        .compare(password, user.password)
        .then((isEqual) => {
          if (!isEqual) {
            return res.json({
              message: "Wrong Password!!!",
              statusCode: 403,
            });
          } else {
            const token = jwt.sign(
              {
                id: user.id,
                email: user.email,
              },
              jwtSecret,
              { expiresIn: "1d" }
            );
            return res.json({
              message: "ok",
              statusCode: 200,
              accessToken: token,
            });
          }
        })
        .catch((err) => {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
        });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
