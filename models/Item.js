const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./user')
const moment = require('moment')
// Define the "item" model
const Item = sequelize.define('item', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,

    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        get(){
            let sendName = this.getDataValue("name")
            return sendName[0].toUpperCase()+sendName.slice(1)
        }
    },
    EmpID: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    selectedDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        get(){
            return moment(this.getDataValue('selectedDate')).format("DD MMM YYYY")
        }
    },
    Designation: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Department: {
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
    printedEnvelope: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    answerBooklet: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    studentNotebook: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    studentNotebookWithGraph: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    studentNotebookWithoutGraph: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    observation: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    purpose: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    withindays: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    Ondate: {
        type: DataTypes.DATE,
        allowNull: true,
        get(){
            return moment(this.getDataValue('OnDate')).format("DD MMM YYYY")
        }
    },
    isapproved: {
        type: DataTypes.BOOLEAN,

    },
    remarks: {
        type: DataTypes.TEXT,
        allowNull: true

    }
    , type: {
        type: DataTypes.STRING,
        defaultValue: 'Items'
    }
});

User.hasMany(Item, {
    onDelete: 'RESTRICT', // Prevent user deletion if associated Seminar exist
})
// Sync the model with the database
// Export the model
module.exports = Item;
