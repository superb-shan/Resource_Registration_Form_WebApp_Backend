const Seminar = require('../models/seminar')
const User = require('../models/user')
const moment = require('moment')
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize')
const sequelize = require('sequelize');
const sendEmail = require('../emailSennder/sendEmail');

const createSeminar = async(req, res) => {
    try {
        // Extract data from the request body
        const {
            userName,
            coordinatorName,
            coordinatorPhoneNumber,
            speakerName,
            speakerPhoneNumber,
            organizingDepartment,
            topic,
            startDateTime,
            endDateTime,
            noOfAttendees,
            equipmentsRequired,
            specialRequirements,
            hallRequired,
            category
        } = req.body;

        // Find the user by name
        const user = await User.findOne({ where: { name: userName } });

        if (!user) {
            res.status(200).send(JSON.stringify({ "message": "User not found" }));
            return;
        }

        // Corrected date and time format
        const dateFormat = "YYYY-MM-DD HH:mm:ss";
        const parsedStartDateTime = moment.utc(startDateTime, dateFormat);
        const parsedEndDateTime = moment.utc(endDateTime, dateFormat);


        const noofDays = parsedEndDateTime.diff(startDateTime, 'days')
        if (noofDays > 20) {
            res.send(JSON.stringify({ "message": `long days booking cannot permitt ${noofDays}` }))
            return;
        }
        const earlyBooking = parsedStartDateTime.diff(moment(), 'days')
        if (earlyBooking > 50) {
            res.send(JSON.stringify({ "message": `No long preior booking can be scheduled` }))
            return;
        }
        // Create a new SeminarHall record
        const seminarHall = await Seminar.create({
            id: uuidv4(),
            userName,
            coordinatorName,
            coordinatorPhoneNumber,
            speakerName,
            speakerPhoneNumber,
            organizingDepartment,
            topic,
            category,
            startDateTime: parsedStartDateTime.local().format(dateFormat),
            endDateTime: parsedEndDateTime.local().format(dateFormat),
            noOfAttendees,
            equipmentsRequired,
            specialRequirements,
            hallRequired,
            "UserId": user.id,
        });

        res.status(200).send(JSON.stringify({ "message": "true", "data": seminarHall }));

    } catch (error) {
        res.status(200).send(error.message);
    }
}
const UpdateSeminar = async(req, res) => {
    try {
        const { isapproved, id, remarks } = req.body;
        const whereClause = {};

        if (isapproved) {
            whereClause.isapproved = isapproved === 'true' ? 1 : 0;
        }
        if (remarks) {
            whereClause.remarks = remarks;
        }

        // Correct the syntax for the update method
        const form = await Seminar.update(whereClause, { where: { id } });

        if (isapproved) {
            if (isapproved === 'true') {
                const form = await Seminar.findOne({ where: { id } })
                const user = await User.findOne({ where: { id: form.UserId } })
                const emailData = {
                    type: "Seminar",
                    receiverName: user.coordinatorName,
                    startDate: form.startDateTime.toString(),
                    endDate: form.endDateTime.toString(),
                    status: "Accepted",
                    username: form.coordinatorName,
                    sendEmail: user.email
                }
                sendEmail(emailData)
            } else {
                const form = await Seminar.findOne({ where: { id } })
                const user = await User.findOne({ where: { id: form.UserId } })
                const emailData = {
                    type: "Seminar",
                    receiverName: user.coordinatorName,
                    startDate: form.startDate.toString() + form.startTime.toString(),
                    endDate: form.endDate.toString() + form.endTime.toString(),
                    status: "Rejected",
                    username: form.coordinatorName,
                    Remark: form.remarks,
                    sendEmail: user.email
                }
                sendEmail(emailData)
            }
        }
        res.send(JSON.stringify({ "message": "success" }));
    } catch (err) {
        res.send(err.message);
    }
}


const GetSeminar = async(req, res) => {
    try {
        const { name, date, isapproved, category, hallRequired } = req.query;
        console.log("Ippathaan", name, date, isapproved, category);
        const whereclause = {}
        if (name) {

            const user = await User.findOne({ where: { name: name } })
            if (!user) {
                res.send(JSON.stringify({ "message": "user not fond" }))
                return;
            }
            whereclause["UserId"] = user.id;
        }
        if (isapproved) {
            whereclause["isapproved"] = {
                [Op.not]: false
            }
        }
        if (category) {
            whereclause["category"] = {
                [Op.eq]: category
            }
        }
        if (date) {
            whereclause["startDateTime"] = {
                [Op.gte]: moment(date.toString()).startOf('day').format("YYYY-MM-DD HH:mm:ss"),
            }
            whereclause["endDateTime"] = {
                [Op.lte]: moment(date.toString()).endOf('day').format("YYYY-MM-DD HH:mm:ss"),
            }
        }
        if (hallRequired) {
            whereclause.hallRequired = {
                [Op.eq]: hallRequired
            }
        }
        console.log(whereclause)

        const result = await Seminar.findAll({
            where: whereclause,
            order: [
                [sequelize.literal('createdAt'), 'DESC']
            ]
        })
        console.log("result", result)
        res.send(JSON.stringify({ "data": (result || []) }))

    } catch (error) {
        res.send(error.message)
    }
}


const DeleteSeminar = async(req, res) => {
    try {


        const key = Object.keys(req.query)
        if (key.length == 0) {
            res.send(JSON.stringify({ "message": "delete command with no arguments" }))
            return;
        }
        const id = req.query.id;
        const result = await Seminar.destroy({ where: { id: id } })
        res.send(JSON.stringify({ "message": "success", "count": result }))

    } catch (err) {
        res.send(err.message)
    }

}




const CheckAvailability = async(req, res) => {
    try {
        const { startDateTime, endDateTime } = req.query;

        console.log("#############", startDateTime, endDateTime);

        // Validate input parameters
        if (!startDateTime || !endDateTime) {
            res.status(200).send({ message: 'Invalid input. Please provide startDate, endDate, startTime, and endTime in the query parameters.' });
            return;
        }

        // Parse dates and times using moment.js
        const dateFormat = "YYYY-MM-DD HH:mm:ss";
        const parsedStartDateTime = moment(startDateTime, dateFormat);
        const parsedEndDateTime = moment(endDateTime, dateFormat);

        // Check if the provided time slot is valid
        if (parsedStartDateTime.isAfter(parsedEndDateTime)) {
            res.send(JSON.stringify({ message: "Invalid time slot. The start date/time should be before the end date/time." }));
            return;
        }
        console.log(parsedEndDateTime.format(dateFormat), parsedStartDateTime.format(dateFormat))
            // Check if there's any seminar hall that overlaps with the provided date and time
        const overlappingSeminarHalls = await Seminar.findAll({
            where: {
                [Op.or]: [{
                    startDateTime: {
                        [Op.lte]: parsedEndDateTime.format(dateFormat),
                    },
                    endDateTime: {
                        [Op.gte]: parsedStartDateTime.format(dateFormat),
                    },
                }, ],
                isapproved: {
                    [Op.not]: false
                }
            },
            attributes: ["hallRequired", "coordinatorName", "organizingDepartment", "startDateTime", "endDateTime", "coordinatorPhoneNumber", "category"],
        });
        console.log(overlappingSeminarHalls)
        if (overlappingSeminarHalls.length === 0) {
            res.send(JSON.stringify({ message: true, overlappingSeminarHalls: [] }));
        } else {
            res.send(JSON.stringify({ message: "The slot is not available", overlappingSeminarHalls }));
        }

    } catch (error) {
        res.send(JSON.stringify({ message: error.message }));
    }
};








module.exports = {
    createSeminar: createSeminar,
    UpdateSeminar: UpdateSeminar,
    GetSeminar: GetSeminar,
    DeleteSeminar,
    CheckAvailability: CheckAvailability
}