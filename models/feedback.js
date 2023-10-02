const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./user')




const feedBack = sequelize.define("feedBack", {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,

    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    department: {
        type: DataTypes.STRING,

    },
    contactNumber: {
        type: DataTypes.STRING,
        validate: {
            isNumeric: true,
            len: [10, 10]
        },
    },
    feedBack: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        defaultValue: 'feedBack'
    }
}, {
    tableName: 'feedBack',
});

// You can add any associations or additional configurations here

// Create the table in the database
User.hasMany(feedBack, {
    onDelete: 'RESTRICT', // Prevent user deletion if associated feedBack exist
})
module.exports = feedBack;