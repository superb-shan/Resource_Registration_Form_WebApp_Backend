const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./user')
const moment = require('moment')


const GuestHouse = sequelize.define("GuestHouse", {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,

    },
    DesignationDepartment: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    AppicantName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    contactNumber: {
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
    ArrivialDateTime: {
        //date of travel
        type: DataTypes.DATE,
        allowNull: false,
        get() {
            return moment(this.getDataValue('ArrivialDateTime')).format('DD-MM-YYYY HH:mm:ss');
        },

    },
    DepartureDateTime: {
        //date of travel
        type: DataTypes.DATE,
        allowNull: false,
        get() {
            return moment(this.getDataValue('DepartureDateTime')).format('DD-MM-YYYY HH:mm:ss');
        },

    },
    Accommodation: {
        type: DataTypes.STRING,
        allowNull: false
    },
    noOfGuest: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notIn: [[0]]
        }
    },
    FoodRequirements: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    Menu: {
        type: DataTypes.STRING,
        allowNull: false

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
        defaultValue: 'GuestHouse'
    }

}, {
    // Options object to define the table name
    tableName: 'guestHouse',

})

User.hasMany(GuestHouse, {
    onDelete: 'RESTRICT', // Prevent user deletion if associated GuestHouse exist
})
module.exports = GuestHouse;