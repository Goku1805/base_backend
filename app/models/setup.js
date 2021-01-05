const Sequelize = require("sequelize");
const path = require("path");
const config = require("./../config");
const envConfig = config[config.env];
const db = {};

let sequelize;
sequelize = new Sequelize(
  envConfig.database,
  envConfig.username,
  envConfig.password,
  envConfig
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
