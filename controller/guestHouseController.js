const GusetHouse = require('../models/GusetHouse')
const User = require('../models/user')
const moment = require('moment')
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize')
const sequelize = require('sequelize')
const createGusetHouse = async (req, res) => {
    try {
        let { userName, DesignationDepartment,
            AppicantName,
            contactNumber,
            name,
            purpose,
            ArrivialDateTime, // Use the appropriate date
            DepartureDateTime, // Use the appropriate date
            Accommodation,
            noOfGuest,
            FoodRequirements,
            Menu, } = req.body;
        const user = await User.findOne({ where: { name: userName } });

        if (!user) {
            res.status(200).send(JSON.stringify({ "message": "user not found" }));
            return;
        }
        //console.log(startTime, endTime, requiredHall);
        const dateTimeFormat = "YYYY-MM-DD HH:mm:ss"; // Corrected date format

        const GusetHouseObj = await GusetHouse.create({
            DesignationDepartment,
            AppicantName,
            contactNumber,
            name,
            purpose,
            ArrivialDateTime: moment(ArrivialDateTime).format(dateTimeFormat), // Use the appropriate date
            DepartureDateTime: moment(DepartureDateTime).format(dateTimeFormat), // Use the appropriate date
            Accommodation,
            noOfGuest,
            FoodRequirements,
            Menu,

            "UserId": user.id, // Use "userId" here (consistent with the model definition)
        });

        res.status(200).send(JSON.stringify({ "message": "true", "GusetHouse": GusetHouseObj }));

    } catch (error) {
        res.status(200).send(error.message);
    }
};



const UpdateGusetHouse = async (req, res) => {
    try {
        const { isapproved, id, remarks } = req.body;
        const whereClause = {}; // Move the whereClause here

        if (isapproved) {
            whereClause.isapproved = isapproved === 'true' ? 1 : 0;
        }
        if (remarks) {
            whereClause.remarks = remarks;
        }

        // Correct the syntax for the update method
        const form = await GusetHouse.update(whereClause, { where: { id } });

        res.send(JSON.stringify({ "message": "success" }));
    } catch (err) {
        res.send(err.message);
    }
}


const GetGusetHouse = async (req, res) => {
    try {
        const { name, date } = req.query;
        const whereclause = {}
        if (name) {

            const user = await User.findOne({ where: { name: name } })
            if (!user) {
                res.send(JSON.stringify({ "message": "user not fond" }))
                return;
            }
            whereclause["UserId"] = user.id;
        }
        if (date) {
            whereclause["ArrivialDateTime"] = {
                [Op.lte]: moment(date).format("YYYY-MM-DD HH:mm:ss"),
            }
            whereclause["DepartureDateTime"] = {
                [Op.gte]: moment(date).format("YYYY-MM-DD HH:mm:ss"),
            }
        }

        const result = await GusetHouse.findAll({
            where: whereclause, order: [
                [sequelize.literal('createdAt'), 'DESC']
            ]
        })
        console.log("result", result)
        res.send(JSON.stringify({ "data": result || [] }))

    } catch (error) {
        res.send(error.message)
    }
}


const DeleteGusetHouse = async (req, res) => {
    try {
        const id = req.query.id;
        const result = await GusetHouse.destroy({ where: { id: id } })
        res.send(JSON.stringify({ "message": "success", "count": result }))

    } catch (err) {
        res.send(err.message)
    }

}




const CheckAvailability = async (req, res) => {
    try {
        const { DepartureDateTime, ArrivialDateTime } = req.query;

        // Validate input parameters


        // Parse dates and times using moment.js
        const dateTimeFormat = "YYYY-MM-DD HH:mm:ss";
        const dept = moment(DepartureDateTime).format(dateTimeFormat);
        const arrival = moment(ArrivialDateTime).format(dateTimeFormat);

        // Check if the provided time slot is valid
        if (dept.isAfter(arrival)) {
            res.send(JSON.stringify({ message: "Invalid time slot. The start date/time should be before the end date/time." }));
            return;
        }

        // Check if there's any GusetHouse that overlaps with the provided date and time and has the same requiredHall value
        const overlappingGusetHouses = await GusetHouse.findAll({
            where: {
                isapproved: {
                    [Op.not]: false
                },
                [Op.or]: [{
                    [Op.or]: [
                        {
                            ArrivialDateTime: {
                                [Op.lte]: dept,
                            },
                            DepartureDateTime: {
                                [Op.gte]: arrival,
                            },


                        },

                    ],
                }]
            },

        });

        if (overlappingGusetHouses.length === 0) {
            res.send(JSON.stringify({ message: true }));
        } else {
            res.send(JSON.stringify({ message: "The slot is not available", overlappingGusetHouses }));
        }

    } catch (error) {
        res.send(JSON.stringify({ message: error.message }));
    }
};







module.exports = {
    createGusetHouse: createGusetHouse,
    UpdateGusetHouse: UpdateGusetHouse,
    GetGusetHouse: GetGusetHouse, DeleteGusetHouse,
    CheckAvailability: CheckAvailability
}