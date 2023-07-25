const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./user')
const { v4: uuidv4 } = require('uuid');



const Transport = sequelize.define("transport", {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
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
        allowNull: false
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
        defaultValue: false,
    },
    remarks: {
        type: DataTypes.TEXT,
        allowNull: true

    }

}, {
    // Options object to define the table name
    tableName: 'Transport',
})

User.hasMany(Transport)
module.exports = Transport;