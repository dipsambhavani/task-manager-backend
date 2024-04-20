const Sequelize = require("sequelize");

const sequelize = require("../utils/database");
const User = require("./user");

const Project = sequelize.define("project", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  owner: {
    type: Sequelize.DataTypes.INTEGER,
    references: {
      model: User,
      key: "id",
    },
    required: true,
  },
  title: { type: Sequelize.DataTypes.STRING, required: true },
  description: { type: Sequelize.DataTypes.STRING, allowNull: true },
  startDate: { type: Sequelize.DataTypes.DATE, allowNull: true },
  endDate: { type: Sequelize.DataTypes.DATE, allowNull: true },
});

module.exports = Project;
