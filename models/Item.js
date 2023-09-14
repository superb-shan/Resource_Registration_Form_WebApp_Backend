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
    purposeOfRequisition: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    requisitionDateTime: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        get() {
            return moment(this.getDataValue('requisitionDateTime')).format("DD MMM YYYY HH:mm:ss");
        }
    },
    // designation: {
    //     type: DataTypes.STRING,
    //     allowNull: true,
    // },
    printing: {
        type: DataTypes.INTEGER,
        allowNull: true,
        default: 0
    },
    guestMomento: {
        type: DataTypes.INTEGER,
        allowNull: true,
        default: 0
    },
    studentMomento: {
        type: DataTypes.INTEGER,
        allowNull: true,
        default: 0
    },
    printedEnvelopes: {
        type: DataTypes.INTEGER,
        allowNull: true,
        default: 0
    },
    answerBooklets: {
        type: DataTypes.INTEGER,
        allowNull: true,
        default: 0
    },
    studentNotebooks: {
        type: DataTypes.INTEGER,
        allowNull: true,
        default: 0
    },
    recordNoteWithGraph: {
        type: DataTypes.INTEGER,
        allowNull: true,
        default: 0
    },
    observationBook: {
        type: DataTypes.INTEGER,
        allowNull: true,
        default: 0
    },
    recordNoteWithoutGraph: {
        type: DataTypes.INTEGER,
        allowNull: true,
        default: 0
    },
    clearanceOfBill: {
        type: DataTypes.DATE,

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
        defaultValue: 'Items'
    }
}, {
    // Additional model options can go here
});

User.hasMany(Item, {
    onDelete: 'RESTRICT',
});

// Sync the model with the database

module.exports = Item;
// sequelize.sync({alter:true})