const Sequelize = require("sequelize");

const sequelize = new Sequelize("task_manager_db", "postgres", "parola", {
  dialect: "postgres",
  host: "localhost",
});

module.exports = sequelize;