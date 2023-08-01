const Sequlize = require('sequelize');
require('dotenv').config();



console.log(process.env.DB_USERNAME, process.env.DB_PASSWORD);

un = process.env.DB_USERNAME;
pwd = process.env.DB_PASSWORD;


const sequelize = new Sequlize("resource", un, pwd, {
    dialect: "mysql",
    logging: false,
})
module.exports = sequelize