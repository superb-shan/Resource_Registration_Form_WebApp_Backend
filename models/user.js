const Sequlize = require('sequelize');
const sequelize = require('../database');
const User = sequelize.define("User", {
    id: {
        type: Sequlize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: Sequlize.STRING,
        allowNull: false,

    },
    email: {
        type: Sequlize.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: Sequlize.STRING,
        allowNull: false,
    }
})


module.exports = User