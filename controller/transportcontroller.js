const Transport = require('../models/transport')
const User = require('../models/user')
const sequelize = require('sequelize')
const moment = require('moment')
const { v4: uuidv4 } = require('uuid');
const createTransport = async (req, res) => {
    try {
        let { name, purposeOfTravel: purpose, formattedDateTime: date, pickupLocation: pickUp, dropLocation: drop, noOfPassengers: passengerCount, specialRequirement: specialRequirements, phoneNumber: number, userName } = req.body;
        console.log("hello", name)
        const user = await User.findOne({ where: { name: userName } });

        if (!user) {
            res.status(200).send({ "message": "User not found" });
            return;
        }
        const dateObject = moment(date);
        const formattedDate = dateObject.format('YYYY-MM-DD');
        const formattedTime = dateObject.format('HH:mm:ss');
        console.log(formattedDate, formattedTime);

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
            console.log(user)
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
            res.send({ "message": "No forms found" });
        } else {
            res.send({ "message": "Forms found", "data": result });
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

        res.send(JSON.stringify({ "message": "success" }));
    } catch (err) {
        res.send(err.message);
    }
}
const deleteTransport = async (req, res) => {
    try {
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

