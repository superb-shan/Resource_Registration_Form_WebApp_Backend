const Sequlize = require('sequelize');
const sequelize = require('../database');
const { checkpass, hashed } = require('../hashPassword')
const Admin = sequelize.define("Admin", {
    id: {
        type: Sequlize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: Sequlize.STRING,
        allowNull: false,
        unique: true,
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
        set(pass) {
            this.setDataValue('password', hashed(pass));
        }
    }
})
module.exports = Admin;