const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./user');
const moment = require('moment');

// Define the "Item" model
const Food = sequelize.define('Food', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    coordinatorEmpId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    coordinatorName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    department: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Menu: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    person: {
        type: DataTypes.INTEGER,
        allowNull: false,
        default:0
    },
    nameOfEvent: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    typeOfEvent: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    coordinatorPhoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isNumeric: true,
            len: [10, 10],
        },
    },
    requisitionDateTime: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        get() {
            return moment(this.getDataValue('requisitionDateTime')).format("DD MMM YYYY HH:mm:ss");
        }
    },
    startDateTime: {
        type: DataTypes.DATE,
        allowNull: false,
        get() {
            return moment(this.getDataValue('startDateTime')).format('DD-MM-YYYY HH:mm:ss');
        },
    },
    endDateTime: {
        type: DataTypes.DATE,
        allowNull: false,
        get() {
            return moment(this.getDataValue('endDateTime')).format('DD-MM-YYYY HH:mm:ss');
        },
    },
    // designation: {
    //     type: DataTypes.STRING,
    //     allowNull: true,
    // },
    BreakfastVeg: {
        type: DataTypes.INTEGER,
        allowNull: true,
        default: 0
    },
    BreakfastNonVeg: {
        type: DataTypes.INTEGER,
        allowNull: true,
        default: 0
    },
    LunchVeg: {
        type: DataTypes.INTEGER,
        allowNull: true,
        default: 0
    },
    LunchNonVeg: {
        type: DataTypes.INTEGER,
        allowNull: true,
        default: 0
    },
    DinnerVeg: {
        type: DataTypes.INTEGER,
        allowNull: true,
        default: 0
    },
    DinnerNonVeg: {
        type: DataTypes.INTEGER,
        allowNull: true,
        default: 0
    },
    MorningRefreshment: {
        type: DataTypes.STRING,
        allowNull: true,
        default: "Not required"
    },
    EveningRefreshment: {
        type: DataTypes.STRING,
        allowNull: true,
        default: "Not required"
    },
    isapproved: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        default: 0
    },
    remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
        default: 0
    },
    type: {
        type: DataTypes.STRING,
        defaultValue: 'Food'
    }
}, {
    // Additional model options can go here
});

User.hasMany(Food, {
    onDelete: 'RESTRICT',
});

// Sync the model with the database

module.exports = Food;
//sequelize.sync({ alter: true })