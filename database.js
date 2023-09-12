const Sequlize = require('sequelize');
require('dotenv').config();




un = process.env.DB_USERNAME;
pwd = process.env.DB_PASSWORD;


const sequelize = new Sequlize("sql12645849", un, pwd, {
    host: 'sql12.freesqldatabase.com',
    dialect: "mysql",
    logging: false,


})
module.exports = sequelize