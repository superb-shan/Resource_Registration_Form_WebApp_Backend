const Seminar = require('../models/seminar')
const User = require('../models/user')
const moment = require('moment')
const { v4: uuidv4 } = require('uuid');

const createSeminar = async (req, res) => {
    try {
        let { name, number, date, startTime, endTime, purpose, no_of_Attendees, seating_capacity, EquipmentRequired, specialRequiremnts } = req.body;
        const user = await User.findOne({ where: { name: name } });

        if (!user) {
            res.status(200).send(JSON.stringify({ "message": "user not found" }));
            return;
        }

        const dateFormat = "YYYY-MM-DD";
        const timeFormat = "HH:mm:ss";
        const parsedDate = moment(date, "DD-MM-YYYY");
        const parsedStartTime = moment(startTime, timeFormat);
        const parsedEndTime = moment(endTime, timeFormat);

        const seminarObj = await Seminar.create({
            id: uuidv4(),
            name: user.name,
            number,
            date: parsedDate.format(dateFormat),
            startTime: parsedStartTime.format(timeFormat),
            endTime: parsedEndTime.format(timeFormat),
            purpose,
            no_of_Attendees,
            seating_capacity,
            EquipmentRequired,
            specialRequiremnts,
            "UserId": user.id, // Use "userId" here (consistent with the model definition)
        });

        res.status(200).send(JSON.stringify({ "message": "Seminar created successfully", "seminar": seminarObj }));

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


module.exports = {
    createSeminar: createSeminar,
    UpdateSeminar: UpdateSeminar,
    GetSeminar: GetSeminar, DeleteSeminar
}