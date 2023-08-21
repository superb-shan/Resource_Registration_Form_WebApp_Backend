const Transport = require('../models/transport');
const User = require('../models/user');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
const sendEmail = require('../emailSennder/sendEmail');

const createTransport = async (req, res) => {
    try {
        const {
            userName,
            coordinatorName,
            coordinatorPhoneNumber,
            guestName,
            guestPhoneNumber,
            purposeOfTravel,
            travelDateTime,
            pickupLocation,
            dropLocation,
            noOfPassengers,
            specialRequirements,

        } = req.body;

        const user = await User.findOne({ where: { name: userName } });

        if (!user) {
            res.status(400).json({ message: "User not found" });
            return;
        }

        const dateObject = moment(travelDateTime);
        const formattedDate = dateObject.format('YYYY-MM-DD');
        const formattedTime = dateObject.format('HH:mm:ss');

        const transport = await Transport.create({
            id: uuidv4(),
            userName,
            coordinatorName,
            coordinatorPhoneNumber,
            guestName,
            guestPhoneNumber,
            purposeOfTravel,
            travelDateTime: formattedDate + ' ' + formattedTime,
            pickupLocation,
            dropLocation,
            noOfPassengers,
            specialRequirements,
            UserId: user.id,
        });

        // Email sending logic for request
        const emailData = {
            type: "Transport",
            receiverName: user.name,
            time: formattedTime,
            date: formattedDate,
            status: "Requested",
            username: userName,
            sendEmail: user.email
        };
        sendEmail(emailData);

        res.status(201).json({ message: "Transport created successfully", data: transport });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: error.message });
    }
}

const updateTransport = async (req, res) => {
    try {
        const { isapproved, id, remarks } = req.body;

        const whereClause = {};

        if (isapproved !== undefined) {
            whereClause.isapproved = isapproved;
        }
        if (remarks) {
            whereClause.remarks = remarks;
        }

        await Transport.update(whereClause, { where: { id } });

        // Email sending logic for approval/rejection
        const transport = await Transport.findOne({ where: { id } });
        const user = await User.findOne({ where: { id: transport.UserId } });

        if (isapproved === 'true') {
            const emailData = {
                type: "Transport",
                receiverName: user.name,
                time: transport.time,
                date: transport.date,
                status: "Accepted",
                username: transport.userName,
                sendEmail: user.email
            };
            sendEmail(emailData);
        } else if (isapproved === 'false') {
            const emailData = {
                type: "Transport",
                receiverName: user.name,
                time: transport.time,
                date: transport.date,
                status: "Rejected",
                username: transport.userName,
                Remark: transport.remarks,
                sendEmail: user.email
            };
            sendEmail(emailData);
        }

        res.status(200).json({ message: "Transport updated successfully" });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
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
        if (date) {
            whereClause.travelDateTime = moment(date.toString()).format('YYYY-MM-DD HH:mm:ss');
        }
        if (status) {
            const statusVal = { "Pending": null, "Success": true, "Rejected": false }
            whereClause.isapproved = statusVal[status]
        }

        const result = await Transport.findAll({
            where: whereClause,
            order: [
                ['createdAt', 'DESC']
            ]
        });

        if (!result || result.length === 0) {
            res.status(404).json({ message: "No forms found", data: [] });
        } else {
            res.status(200).json({ message: "Forms found", data: result });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: "Error retrieving forms" });
    }
}

const deleteTransport = async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            res.status(400).json({ message: "Delete command with no arguments" });
            return;
        }

        await Transport.destroy({ where: { id } });
        res.status(204).end();
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    deleteTransport,
    getTransport,
    updateTransport,
    createTransport
}
