const Sequlize = require('sequelize');
require('dotenv').config();




un = process.env.DB_USERNAME;
pwd = process.env.DB_PASSWORD;

unn = process.env.DB_USERNAMEE;//local
pwdd = process.env.DB_PASSWORDD;


const sequelize = new Sequlize("db_aa380b_jeethul", un, pwd, {
     host: 'mysql5045.site4now.net',
   // host: 'localhost',
    dialect: "mysql",
    logging: false,
    timezone: '+05:30',
    dialectOptions: {
        useUTC: false //for reading from database
    },

}) 
module.exports = sequelize