const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const sequelize = require("./utils/database");
const User = require('./model/user');
const Task = require('./model/task');

User.belongsToMany(Task, { through: 'user_task'});
Task.belongsToMany(User, { through: 'user_task'});


const auth = require("./router/auth");
const task = require("./router/task");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

app.get("/health", (req, res) => {
  return res.send("Ok");
});

app.use(auth.router);
app.use(task.router);

app.use((error, req, res, next) => {
    console.log("in the middel were :" , error);
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
    console.log("in the server call :" ,err);
  });
