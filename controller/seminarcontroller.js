const Seminar = require('../models/seminar')
const User = require('../models/user')
const moment = require('moment')
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize')

const createSeminar = async (req, res) => {
    try {
        let { name, contactNumber: number, startDate, endDate, startTime, designation: DesignationDepartment, requiredhall: requiredHall, endTime, purpose, noOfAttendees: no_of_Attendees, seating_capacity, equipmentNeeded: EquipmentRequired, specialRequiremnts } = req.body;
        const user = await User.findOne({ where: { name: name } });

        if (!user) {
            res.status(200).send(JSON.stringify({ "message": "user not found" }));
            return;
        }
        //console.log(startTime, endTime, requiredHall);
        const dateFormat = "YYYY-MM-DD"; // Corrected date format
        const timeFormat = "HH:mm:ss";
        const parsedstartDate = moment(startDate);
        const parsedendDate = moment(endDate)
        const parsedStartTime = moment(startTime, timeFormat);
        const parsedEndTime = moment(endTime, timeFormat);
        console.log(parsedstartDate.format("YYYY-MM-DD"), parsedendDate.format("YYYY-MM-DD"))
        const seminarObj = await Seminar.create({
            id: uuidv4(),
            name: user.name,
            contactNumber: number,
            startDate: parsedstartDate.format("YYYY-MM-DD"),
            startTime: parsedStartTime.format(timeFormat),
            endTime: parsedEndTime.format(timeFormat),
            endDate: parsedendDate.format("YYYY-MM-DD"),
            purpose,
            requiredHall,
            DesignationDepartment,
            noOfAttendees: no_of_Attendees,
            seating_capacity: seating_capacity || 20,
            EquipmentRequired,
            specialRequiremnts,
            "UserId": user.id, // Use "userId" here (consistent with the model definition)
        });

        res.status(200).send(JSON.stringify({ "message": "true", "seminar": seminarObj }));

    } catch (error) {
        res.status(200).send(error.message);
    }
};



const UpdateSeminar = async (req, res) => {
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
        const form = await Seminar.update(whereClause, { where: { id } });

        res.send(JSON.stringify({ "message": "success" }));
    } catch (err) {
        res.send(err.message);
    }
}


const GetSeminar = async (req, res) => {
    try {
        const { name } = req.query;
        const user = await User.findOne({ where: { name: name } })
        if (!user) {
            res.send(JSON.stringify({ "message": "user not fond" }))
            return;
        }

        const result = await Seminar.findAll({ where: { UserId: user.id } })

        res.send(result)

    } catch (error) {

    }
}


const DeleteSeminar = async (req, res) => {
    try {
        const id = req.query.id;
        const result = await Seminar.destroy({ where: { id: id } })
        res.send(JSON.stringify({ "message": "success", "count": result }))

    } catch (err) {
        res.send(err.message)
    }

}


const CheckAvilablity = async (req, res) => {
    try {
        const { startDate, endDate, startTime, endTime } = req.query;

        // Validate input parameters
        if (!startDate || !endDate || !startTime || !endTime) {
            res.status(400).send({ message: 'Invalid input. Please provide startDate, endDate, startTime, endTime, and requiredHall in the query parameters.' });
            return;
        }

        // Parse dates and times using moment.js
        const dateFormat = "YYYY-MM-DD";
        const timeFormat = "HH:mm:ss";
        const parsedStartDate = moment(startDate, dateFormat);
        const parsedEndDate = moment(endDate, dateFormat);
        const parsedStartTime = moment(startTime, timeFormat);
        const parsedEndTime = moment(endTime, timeFormat);

        // Check if the provided time slot is valid
        if (parsedStartDate.isAfter(parsedEndDate) || parsedStartTime.isAfter(parsedEndTime)) {
            res.send(JSON.stringify({ message: "Invalid time slot. The start date/time should be before the end date/time." }));
            return;
        }

        // Check if there's any seminar that overlaps with the provided date and time and has the same requiredHall value
        const overlappingSeminars = await Seminar.findAll({
            where: {

                [Op.or]: [
                    {
                        startDate: {
                            [Op.lt]: parsedEndDate.format(dateFormat),
                        },
                        endDate: {
                            [Op.gt]: parsedStartDate.format(dateFormat),
                        },
                    },
                    {
                        startDate: {
                            [Op.eq]: parsedStartDate.format(dateFormat),
                        },
                        startTime: {
                            [Op.lt]: parsedEndTime.format(timeFormat),
                        },
                    },
                    {
                        endDate: {
                            [Op.eq]: parsedEndDate.format(dateFormat),
                        },
                        endTime: {
                            [Op.gt]: parsedStartTime.format(timeFormat),
                        },
                    },
                    {
                        endDate: {
                            [Op.eq]: parsedStartDate.format(dateFormat),
                        },
                        endTime: {
                            [Op.gt]: parsedStartTime.format(timeFormat),
                        }

                    }
                ],
            },
            attributes: ["requiredHall"],
        });

        if (overlappingSeminars.length === 0) {
            res.send(JSON.stringify({ message: true }));
        } else {
            res.send(JSON.stringify({ message: "The slot is not available", overlappingSeminars }));
        }

    } catch (error) {
        res.send(JSON.stringify({ message: error.message }));
    }
};







module.exports = {
    createSeminar: createSeminar,
    UpdateSeminar: UpdateSeminar,
    GetSeminar: GetSeminar, DeleteSeminar,
    CheckAvilablity: CheckAvilablity
}