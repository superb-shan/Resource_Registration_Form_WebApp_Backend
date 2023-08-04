const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./user')
const { v4: uuidv4 } = require('uuid');
const moment = require('moment')


const Seminar = sequelize.define("Seminar", {
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
    startDate: {
        //date of travel
        type: DataTypes.DATEONLY,
        allowNull: false,
        get() {
            return moment(this.getDataValue('date')).format('DD-MM-YYYY');
        },
        validate: {
            isDate: true,
            isAfter: moment().format('YYYY-MM-DD'),

        }
    },
    EndDate: {
        //date of travel
        type: DataTypes.DATEONLY,
        allowNull: false,
        get() {
            return moment(this.getDataValue('date')).format('DD-MM-YYYY');
        },
        validate: {
            isDate: true,
            isAfter: moment().format('YYYY-MM-DD'),

        }
    },
    startTime: {
        type: DataTypes.TIME,
        allowNull: false
    },
    endTime: {
        type: DataTypes.TIME,
        allowNull: false
    },
    no_of_Attendees: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notIn: [[0]]
        }
    },
    seating_capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notIn: [[0]]
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
    ,type:{
        type:DataTypes.STRING,
        defaultValue:'Seminar'
    }

}, {
    // Options object to define the table name
    tableName: 'seminar',

})

User.hasMany(Seminar)
module.exports = Seminar;