const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./user')
const { v4: uuidv4 } = require('uuid');
const moment = require('moment')



const Transport = sequelize.define("Transport", {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    number: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isNumeric: true,
            len: [10, 10]
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false

    },
    purpose: {
        //store the purpose of travel
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        //date of travel
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            isDate: true,
        }
    },
    time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    pickUp: {
        type: DataTypes.STRING,
        allowNull: false
    },
    drop: {
        type: DataTypes.STRING,
        allowNull: false
    },
    passengerCount: {
        type: DataTypes.SMALLINT,
        allowNull: false
    },
    specialRequirements: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    isapproved: {
        type: DataTypes.BOOLEAN,

    },
    remarks: {
        type: DataTypes.TEXT,
        allowNull: true

    }

}, {
    tableName: "Transport"
})

User.hasMany(Transport)
// Assuming your sequelize object is correctly initialized and connected to the database


module.exports = Transport;