const Sequlize = require('sequelize');
require('dotenv').config();




un = process.env.DB_USERNAME;
pwd = process.env.DB_PASSWORD;


const sequelize = new Sequlize("db_a9fc24_jeethth", un, pwd, {
    host: 'mysql8002.site4now.net',
    dialect: "mysql",
    logging: false,
    timezone: '+05:30',
    dialectOptions: {
        useUTC: false //for reading from database
    },

}) 
module.exports = sequelize