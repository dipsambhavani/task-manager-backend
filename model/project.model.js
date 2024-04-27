const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const Project = sequelize.define("project", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: { type: Sequelize.DataTypes.STRING, required: true },
  description: { type: Sequelize.DataTypes.STRING, allowNull: true },
  startDate: { type: Sequelize.DataTypes.DATE, allowNull: true },
  endDate: { type: Sequelize.DataTypes.DATE, allowNull: true },
});

module.exports = Project;
