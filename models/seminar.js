const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./user');
const moment = require('moment');

const Seminar = sequelize.define("SeminarHall", {
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
            len: [10, 10],
        },
    },
    category: {
        type: DataTypes.STRING,
        defaultValue: "Auditorium/ Training Halls",
    },
    speakerName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    speakerPhoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isNumeric: true,
            len: [10, 10],
        },
    },
    organizingDepartment: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    topic: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    startDateTime: {
        type: DataTypes.DATE,
        allowNull: false,
        get() {
            return moment(this.getDataValue('startDateTime')).format('YYYY-MM-DD HH:mm:ss');
        },
    },
    endDateTime: {
        type: DataTypes.DATE,
        allowNull: false,
        get() {
            return moment(this.getDataValue('endDateTime')).format('YYYY-MM-DD HH:mm:ss');
        },
    },
    noOfAttendees: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notIn: [
                [0]
            ],
        },
    },
    equipmentsRequired: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "Nil"
    },
    specialRequirements: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    hallRequired: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isapproved: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    type: {
        type: DataTypes.STRING,
        defaultValue: 'Seminar'
    }
}, {
    tableName: 'seminar_hall',
});

User.hasMany(Seminar, {
    onDelete: 'RESTRICT', // Prevent user deletion if associated SeminarHall exists
});

module.exports = Seminar;