const express = require("express");
const sequelize = require("./utils/database");
const bodyParser = require("body-parser");
const cors = require("cors");

const auth = require("./router/auth");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

app.get("/health", (req, res) => {
  return res.send("Ok");
});

app.use(auth.router);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data});
  });

sequelize
  .sync()
  .then((result) => {
    app.listen(3000, () => {
      console.log("====> Server is running");
    });
  })
  .catch((err) => {
    console.log(err);
  });
