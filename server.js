const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const sequelize = require("./utils/database");
const User = require("./model/user");
const Task = require("./model/task");
const Project = require("./model/project");

// Associatoin------------------------------------------------------------------------------
User.belongsToMany(Task, { through: "user_task", onDelete: "CASCADE" });
Task.belongsToMany(User, { through: "user_task", onDelete: "CASCADE" });

Project.belongsToMany(User, {
  through: "project_members",
  onDelete: "CASCADE",
});
User.belongsToMany(Project, {
  through: "project_members",
  onDelete: "CASCADE",
});

Project.belongsTo(User, { foreignKey: "owner" });
User.hasMany(Project, { foreignKey: "owner" });

Project.hasMany(Task);
Task.belongsTo(Project);

// Routers-----------------------------------------------------------------------------------
const auth = require("./router/auth");
const task = require("./router/task");
const project = require("./router/project");
const { FORCE } = require("sequelize/lib/index-hints");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

app.use("/auth", auth.router);
app.use("/task", task.router);
app.use("/project", project.router);

app.use((error, req, res, next) => {
  console.log("in the middel were :", error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

sequelize
  .sync({ alter: true })
  .then((result) => {
    app.listen(3000, () => {
      console.log("====> Server is running");
    });
  })
  .catch((err) => {
    console.log("in the server call :", err);
  });
