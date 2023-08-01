const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./user')
const { v4: uuidv4 } = require('uuid');



const Seminar = sequelize.define("transport", {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        
    },
    number:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            isNumeric: true,
            len: [10,10]
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
    },
    startTime: {
        type: DataTypes.TIME,
        allowNull: false
    },
    endTime: {
        type: DataTypes.TIME,
        allowNull: false
    },
   no_of_Attendees:{
    type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notIn:[[0]]
        }
   },
   seating_capacity:{
    type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            notIn:[[0]]
        }
   },
  
    EquipmentRequired: {
        type: DataTypes.TEXT,
        allowNull: true
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
    // Options object to define the table name
    tableName: 'Seminar',
})

User.hasMany(Seminar)
module.exports = Seminar;