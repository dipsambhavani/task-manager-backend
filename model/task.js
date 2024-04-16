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
  priority: { type: Sequelize.DataTypes.STRING, allowNull: false },
  startDate: { type: Sequelize.DataTypes.DATEONLY, allowNull: true },
  endDate: { type: Sequelize.DataTypes.DATEONLY, allowNull: true },
  status: { type: Sequelize.DataTypes.STRING, allowNull: false },
});

module.exports = Task;
