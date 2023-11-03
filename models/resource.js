const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');

// Define the "Resource" model
const Resource = sequelize.define('Resource', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,

    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,

    },
    capacity: {
        type: DataTypes.STRING,
        allowNull: true,

    },

}, {
    getterMethods: {
        NumberCapacity() {
            return Number(this.capacity);
        }
    }
});

// Sync the model with the database
// Export the model
module.exports = Resource;