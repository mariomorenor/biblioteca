const { Sequelize, DataTypes, Op } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(__dirname, "database.sqlite"),
});

const records = sequelize.define("records", {
  date: DataTypes.DATE,
  name: DataTypes.STRING,
  last_name: DataTypes.STRING,
  dni: DataTypes.STRING,
  email: DataTypes.STRING,
  user_id: DataTypes.INTEGER,
  seccion: DataTypes.STRING
});

records.sync();

module.exports = {
  records,
  Op,
  sequelize
}