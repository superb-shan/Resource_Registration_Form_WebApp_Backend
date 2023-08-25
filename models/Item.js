const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./user');
const moment = require('moment');

// Define the "Item" model
const Item = sequelize.define('Item', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,

    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    requestorEmpId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    requestorName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    department: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    purposeOfItem: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    requisitionDateTime: {
        type: DataTypes.DATE,
        allowNull: true,
        get() {
            return moment(this.getDataValue('ItemDateTime')).format("DD MMM YYYY");
        }
    },
    designation: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    printing: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    guestMomento: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    studentMomento: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    printedEnvelopes: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    answerBooklets: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    studentNotebooks: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    recordNoteWithGraph: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    observationBook: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    recordNoteWithoutGraph: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    clearanceOfBill: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    isapproved: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    // Additional model options can go here
});

User.hasMany(Item, {
    onDelete: 'RESTRICT',
});

// Sync the model with the database

module.exports = Item;
