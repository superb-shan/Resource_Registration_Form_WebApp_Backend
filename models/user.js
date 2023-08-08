const Sequlize = require('sequelize');
const { checkpass, hashed } = require('../hashPassword')

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


module.exports = User