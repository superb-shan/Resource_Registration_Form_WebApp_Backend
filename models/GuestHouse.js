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
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    coordinatorName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    coordinatorPhoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isNumeric: true,
            len: [10, 10]
        },
    },
    guestName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    guestPhoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isNumeric: true,
            len: [10, 10]
        },
    },
    organizingDepartment: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    purposeOfStay: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    foodRequired: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    menuRequired: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    paymentDoneBy: {
        type: DataTypes.STRING,
        allowNull: false,
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
    noOfGuests: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notIn: [[0]]
        },
    },
    roomRequired: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    specialRequirements: {
        type: DataTypes.TEXT,
        allowNull: true,
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
    tableName: 'guestHouse',
});

// You can add any associations or additional configurations here

// Create the table in the database
User.hasMany(GuestHouse, {
    onDelete: 'RESTRICT', // Prevent user deletion if associated GuestHouse exist
})
module.exports = GuestHouse;
