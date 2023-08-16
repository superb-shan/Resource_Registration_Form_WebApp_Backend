const Transport = require('../models/transport')
const User = require('../models/user')
const sequelize = require('sequelize')
const moment = require('moment')
const { v4: uuidv4 } = require('uuid');
const sendEmail = require('../emailSennder/sendEmail');
const createTransport = async (req, res) => {
    try {
        let { name, purposeOfTravel: purpose, formattedDateTime: date, pickupLocation: pickUp, dropLocation: drop, noOfPassengers: passengerCount, specialRequirement: specialRequirements, phoneNumber: number, userName } = req.body;

        const user = await User.findOne({ where: { name: userName } });

        if (!user) {
            res.status(200).send({ "message": "User not found" });
            return;
        }
        const dateObject = moment(date);
        const formattedDate = dateObject.format('YYYY-MM-DD');
        const formattedTime = dateObject.format('HH:mm:ss');


        const transport = await Transport.create({
            id: uuidv4(),
            name,
            purpose,
            "date": formattedDate,
            "time": formattedTime,
            pickUp,
            drop,
            number,
            passengerCount,
            specialRequirements,
            "UserId": user.id,
        });

        const form = transport
        let emailData = {
            type: "Transport",
            receiverName: user.name,
            time: form.time,
            date: form.date,
            status: "Requested",
            username: form.name,
            Remark: form.remarks,
            sendEmail: user.email
        }
        sendEmail(emailData)

        emailData = {
            type: "Transport",
            receiverName: user.name,
            time: form.time,
            date: form.date,
            status: "Requested",
            username: form.name,
            Remark: form.remarks,
            sendEmail: "jeethupachi@gmail.com"
        }
        sendEmail(emailData)
        res.send({ "message": true, "data": transport.toJSON() });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(200).send(JSON.stringify({ 'message': error.message }));
    }
}


const getTransport = async (req, res) => {
    const { UserId, id, name, date, status } = req.query;

    try {
        const whereClause = {};

        if (id) {
            whereClause.id = id;
        }
        if (UserId) {
            whereClause.UserId = UserId;
        }
        if (name) {
            const user = await User.findOne({ where: { name: name } })

            whereClause.UserId = user.id;
        }

        // if (purpose) {
        //   whereClause.purpose = purpose;
        // }
        if (date) {
            whereClause.date = moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD')
        }
        // if (pickUp) {
        //   whereClause.pickUp = pickUp;
        // }
        // if (drop) {
        //   whereClause.drop = drop;
        // }
        // if (passengerCount) {
        //   whereClause.passengerCount = passengerCount;
        // }
        if (status) {
            const statusVal = { "Pending": null, "Success": 1, "Rejected": 0 }
            whereClause.isapproved = statusVal[status]
        }
        if (date) {
            const s_date = moment(date, "DD-MM-YYYY").format('YYYY-MM-DD')
            whereClause.date = s_date;
        }
        const result = await Transport.findAll({
            where: whereClause,
            order: [
                [sequelize.literal('createdAt'), 'DESC']
            ]
        });

        if (!result || result.length === 0) {
            res.send({ "message": "No forms found", "data": result || [] });
        } else {
            res.send({ "message": "Forms found", "data": result || [] });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(200).send({ "message": "Error retrieving forms" });
    }
}


const updateTransport = async (req, res) => {
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
        const form = await Transport.update(whereClause, { where: { id } });
        if (isapproved) {
            if (isapproved === 'true') {
                const form = await Transport.findOne({ where: { id } })
                const user = await User.findOne({ where: { id: form.UserId } })
                const emailData = {
                    type: "Transport",
                    receiverName: user.name,
                    time: form.time,
                    date: form.date,
                    status: "Accepted",
                    username: form.name,
                    sendEmail: user.email
                }
                sendEmail(emailData)
            }
            else {
                const form = await Transport.findOne({ where: { id } })
                const user = await User.findOne({ where: { id: form.UserId } })
                const emailData = {
                    type: "Transport",
                    receiverName: user.name,
                    time: form.time,
                    date: form.date,
                    status: "Rejected",
                    username: form.name,
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
const deleteTransport = async (req, res) => {
    try {


        const key = Object.keys(req.query)
        if (key.length == 0) {
            res.send(JSON.stringify({ "message": "delete command with no arguments" }))
            return;
        }
        const id = req.query.id;
        // Your deletion logic here, based on the transportId
        // ...



        const del = await Transport.destroy({ where: { id: id } })
        res.send(JSON.stringify({ "message": "Successfully deleted", "data": del }))
        return;
    } catch (err) {
        res.send(err.message)
    }

}
module.exports = {
    deleteTransport: deleteTransport,
    getTransport: getTransport,
    updateTransport: updateTransport,
    createTransport: createTransport

}

