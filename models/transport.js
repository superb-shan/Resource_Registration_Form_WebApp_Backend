// const { Sequelize, DataTypes } = require('sequelize');
// const sequelize = require('../database');
// const User = require('./user')
// const { v4: uuidv4 } = require('uuid');
// const moment = require('moment')



// const Transport = sequelize.define("Transport", {
//     id: {
//         type: DataTypes.UUID,
//         defaultValue: Sequelize.UUIDV4,
//         primaryKey: true,
//     },
//     type:{
//         type: DataTypes.STRING,
//         defaultValue: "Transport"
//     },
//     number: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         validate: {
//             isNumeric: true,
//             len: [10, 10]
//         }
//     },
//     name: {
//         type: DataTypes.STRING,
//         allowNull: false

//     },
//     purpose: {
//         //store the purpose of travel
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     date: {
//         //date of travel
//         type: DataTypes.DATEONLY,
//         allowNull: false,
//         validate: {
//             isDate: true,
//         }
//     },
//     time: {
//         type: DataTypes.TIME,
//         allowNull: false
//     },
//     pickUp: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     drop: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     passengerCount: {
//         type: DataTypes.SMALLINT,
//         allowNull: false
//     },
//     specialRequirements: {
//         type: DataTypes.TEXT,
//         allowNull: true
//     },
//     isapproved: {
//         type: DataTypes.BOOLEAN,

//     },
//     remarks: {
//         type: DataTypes.TEXT,
//         allowNull: true

//     }

// }, {
//     tableName: "Transport"
// })

// User.hasMany(Transport, {
//     onDelete: 'RESTRICT', // Prevent user deletion if associated transports exist
//   });

// module.exports = Transport;




const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./user');
const moment = require('moment');

const Transport = sequelize.define("Transport", {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    coordinatorName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    coordinatorPhoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isNumeric: true,
            len: [10, 10]
        }
    },
    guestName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    guestPhoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isNumeric: true,
            len: [10, 10]
        }
    },
    purposeOfTravel: {
        type: DataTypes.STRING,
        allowNull: false
    },
    travelDateTime: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isDate: true,
        },
        get() {

            return moment.utc(this.getDataValue('travelDateTime')).local().format('YYYY-MM-DD HH:mm:ss');
        }
    },
    pickupLocation: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dropLocation: {
        type: DataTypes.STRING,
        allowNull: false
    },
    noOfPassengers: {
        type: DataTypes.SMALLINT,
        allowNull: false
    },
    specialRequirements: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    remarks: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    organizingDepartment: {
        type: DataTypes.STRING,
        allowNull: true
    },

    isapproved: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    type: {
        type: DataTypes.STRING,
        defaultValue: 'Transport'
    }
}, {
    tableName: "Transport"
});

User.hasMany(Transport, {
    onDelete: 'RESTRICT', // Prevent user deletion if associated transports exist
});

module.exports = Transport;
