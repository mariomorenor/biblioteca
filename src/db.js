const { Sequelize, DataTypes, Op } = require("sequelize");
const path = require("path");
const { app } = require("electron");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.resolve(app.getAppPath(), "database.sqlite"),
  logging: false,
});

const records = sequelize.define("records", {
  date: DataTypes.DATE,
  name: DataTypes.STRING,
  last_name: DataTypes.STRING,
  dni: DataTypes.STRING,
  email: DataTypes.STRING,
  user_id: DataTypes.INTEGER,
  seccion: DataTypes.STRING,
});

records.sync();

module.exports = {
  records,
  Op,
  sequelize,
};
