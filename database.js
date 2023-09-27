const Sequlize = require('sequelize');
require('dotenv').config();




un = process.env.DB_USERNAME;
pwd = process.env.DB_PASSWORD;


const sequelize = new Sequlize("sql12649382", un, pwd, {
    host: 'sql12.freesqldatabase.com',
    dialect: "mysql",
    logging: false,
    timezone: '+05:30',
    dialectOptions: {
        useUTC: false //for reading from database
    },

}) 
module.exports = sequelize