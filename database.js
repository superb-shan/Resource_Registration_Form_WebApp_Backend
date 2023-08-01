const Sequlize = require('sequelize')


const sequelize = new Sequlize("resource", "root", "1001", {
    dialect: "mysql",
    logging: false,
})
module.exports = sequelize