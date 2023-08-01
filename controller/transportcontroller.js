const Transport = require('../models/transport')

const { v4: uuidv4 } = require('uuid');
const createTransport = async (req, res) => {
    try {
        let { name, purpose, date, pickUp, drop, passengerCount, specialRequirements } = req.body;
        const user = await User.findOne({ where: { name: name } });

        if (!user) {
            res.status(404).send({ "message": "User not found" });
            return;
        }
        console.log(user.name);
        const options = { hour12: false, hour: '2-digit', minute: '2-digit' };
        date = new Date(date).toISOString().slice(0, 10);
        let time = new Date(date).toLocaleTimeString([], options);

        const transport = await Transport.create({
            id: uuidv4(),
            name,
            purpose,
            date,
            time,
            pickUp,
            drop,
            passengerCount,
            specialRequirements,
            UserId: user.id,
        });

        res.send({ "message": true, "data": transport.toJSON() });
    } catch (error) {
        console.error('Error:', error);
        res.status(200).send({ "message": "Error creating transport" });
    }
}


const getTransport = async (req, res) => {
    const { UserId, id } = req.query;

    try {
        const whereClause = {};

        if (id) {
            whereClause.id = id;
        }
        if (UserId) {
            whereClause.UserId = UserId;
        }
        // if (name) {
        //   whereClause.name = name;
        // }

        // if (purpose) {
        //   whereClause.purpose = purpose;
        // }
        // if (date) {
        //   whereClause.date = date;
        // }
        // if (pickUp) {
        //   whereClause.pickUp = pickUp;
        // }
        // if (drop) {
        //   whereClause.drop = drop;
        // }
        // if (passengerCount) {
        //   whereClause.passengerCount = passengerCount;
        // }
        const result = await Transport.findAll({
            where: whereClause,
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
        const id = req.params.id;
        // Your deletion logic here, based on the transportId
        // ...



        const del = await Transport.destroy({ where: { id: id } })
        res.send(JSON.stringify({ "message": "success", "data": del }))
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

