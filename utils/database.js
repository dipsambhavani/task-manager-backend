const Sequelize = require("sequelize");

const sequelize = new Sequelize("project_db", "postgres", "postgres", {
  dialect: "postgres",
  host: "localhost",
});

module.exports = sequelize;