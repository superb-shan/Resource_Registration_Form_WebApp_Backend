const Sequlize = require('sequelize');
require('dotenv').config();




un = process.env.DB_USERNAME;
pwd = process.env.DB_PASSWORD;


const sequelize = new Sequlize("resource", un, pwd, {
    dialect: "mysql",
    logging: false,
})
module.exports = sequelize