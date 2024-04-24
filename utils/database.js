const Sequelize = require("sequelize");

const sequelize = new Sequelize("task_manager_db", "postgres", "postgres", {
  dialect: "postgres",
  host: "localhost",
});

module.exports = sequelize;