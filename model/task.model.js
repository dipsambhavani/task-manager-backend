const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const Task = sequelize.define("task", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: { type: Sequelize.DataTypes.STRING, allowNull: false },
  description: { type: Sequelize.DataTypes.STRING, allowNull: true },
  priority: { type: Sequelize.DataTypes.INTEGER, allowNull: false },
  startDate: { type: Sequelize.DataTypes.DATE, allowNull: true },
  endDate: { type: Sequelize.DataTypes.DATE, allowNull: true },
  status: { type: Sequelize.DataTypes.STRING, allowNull: false },
  createdAt: { type: Sequelize.DATE, allowNull: false },
});

module.exports = Task;
