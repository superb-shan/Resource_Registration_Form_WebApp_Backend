const Transport = require('../models/transport');
const User = require('../models/user');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
const sendEmail = require('../emailSennder/sendEmail');
const { Op, where } = require('sequelize');
const createTransport = async (req, res) => {
    try {
        const {
            userName,
            coordinatorName,
            coordinatorPhoneNumber,
            guestName,
            organizingDepartment,
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
            res.status(200).json({ message: "User not found" });
            return;
        }

        const dateObject = moment.utc(travelDateTime);
        const formattedDate = dateObject.local().format('YYYY-MM-DD');
        const formattedTime = dateObject.local().format('HH:mm:ss');
        console.log(dateObject.toString())
        const transport = await Transport.create({
            id: uuidv4(),
            userName,
            coordinatorName,
            coordinatorPhoneNumber,
            organizingDepartment,
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
            sendEmail: user.email,
            Department: transport.organizingDepartment
        };
        sendEmail(emailData);

        res.status(201).json({ message: "Transport created successfully", data: transport });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(200).json({ message: error.message });
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
        console.log("hi")

        await Transport.update(whereClause, { where: { id } });

        // Email sending logic for approval/rejection
        const transport = await Transport.findOne({ where: { id } });
        const user = await User.findOne({ where: { id: transport.UserId } });
        console.log(transport, user);
        if (isapproved === 'true') {
            const emailData = {
                type: "Transport",
                receiverName: user.name,
                DateTime: transport.travelDateTime,
                status: "Accepted",
                username: transport.userName,
                sendEmail: user.email
            };
            sendEmail(emailData);
        } else if (isapproved === 'false') {
            const emailData = {
                type: "Transport",
                receiverName: user.name,
                DateTime: transport.travelDateTime,

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
        res.status(200).json({ message: error.message });
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
            // Modify the date filter to cover the entire day from 00:00:00 to 23:59:59
            const startDate = moment(date.toString()).startOf('day').format('YYYY-MM-DD HH:mm:ss');
            const endDate = moment(date.toString()).endOf('day').format('YYYY-MM-DD HH:mm:ss');
            console.log(startDate, endDate);
            whereClause.travelDateTime = {
                [Op.lte]: endDate,
                [Op.gte]: startDate
            };
        }
        if (status) {
            const statusVal = { "Pending": null, "Success": true, "Rejected": false }
            whereClause.isapproved = statusVal[status];
        }
        console.log(whereClause)
        const result = await Transport.findAll({
            where: whereClause,
            order: [
                ['createdAt', 'DESC']
            ]
        });

        if (!result || result.length === 0) {
            res.status(200).json({ message: "No forms found", data: [] });
        } else {
            res.status(200).json({ message: "Forms found", data: result });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(200).json({ message: "Error retrieving forms" });
    }
}


const deleteTransport = async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            res.status(200).json({ message: "Delete command with no arguments" });
            return;
        }

        await Transport.destroy({ where: { id } });
        res.status(204).end();
    } catch (error) {
        console.error('Error:', error);
        res.status(200).json({ message: 'Internal server error' });
    }
}

module.exports = {
    deleteTransport,
    getTransport,
    updateTransport,
    createTransport
}
