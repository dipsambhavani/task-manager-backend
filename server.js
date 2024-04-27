const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const sequelize = require("./utils/database");
const User = require("./model/user.model");
const Task = require("./model/task.model");
const Project = require("./model/project.model");

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

Project.belongsTo(User, { as: "owner" });

Project.hasMany(Task, { onDelete: "CASCADE" });
Task.belongsTo(Project);

// Routers-----------------------------------------------------------------------------------
const auth = require("./router/auth.router");
const task = require("./router/task.router");
const project = require("./router/project.router");

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
  .then(() => {
    app.listen(3000, () => {
      console.log("===> Server is up & running on http://localhost:3000");
    });
  })
  .catch((err) => {
    console.log("in the server call :", err);
  });
