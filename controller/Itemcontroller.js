const Item = require("../models/Item");
const User = require("../models/user");
const moment = require("moment");
const sequelize = require("sequelize");
const createItem = async (req, res) => {
    try {
        const {
            name,
            EmpID,
            selectedDate,
            Designation,
            Department,
            printing,
            guestMomento,
            studentMomento,
            printedEnvelope,
            answerBooklet,
            studentNotebook,
            studentNotebookWithGraph,
            studentNotebookWithoutGraph,
            observation,
            purpose,
            withindays,
            Ondate,
            userName

        } = req.body



        const user = await User.findOne({ where: { name: userName } })
        if (!user) {
            res.send(JSON.stringify({ "message": "No user found" }))
        }
        const item = await Item.create({
            name,
            EmpID,
            selectedDate: moment(selectedDate).format('YYYY-MM-DD'),
            Designation,
            Department,
            printing,
            guestMomento,
            studentMomento,
            printedEnvelope,
            answerBooklet,
            studentNotebook,
            studentNotebookWithGraph,
            studentNotebookWithoutGraph,
            observation,
            purpose,
            withindays,
            Ondate,
            UserId: user.id,
        })
        res.send(JSON.stringify({ "message": true, "data": item }))

    } catch (error) {
        res.send(JSON.stringify({ "message": false, "error": error.message }))

    }
}


const getItem = async (req, res) => {
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
            whereClause.selectedDate = moment(date).format('YYYY-MM-DD')
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
        const result = await Item.findAll({
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


const updateItem = async (req, res) => {
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
        const form = await Item.update(whereClause, { where: { id } });
        // if (isapproved) {
        //     if (isapproved === 'true') {
        //         const form = await Item.findOne({ where: { id } })
        //         const user = await User.findOne({ where: { id: form.UserId } })
        //         const emailData = {
        //             receiverName: user.name,

        //             date: form.selectedDate,
        //             status: "Accepted",
        //             username: form.name,
        //             sendEmail: user.email
        //         }
        //         sendEmail(emailData)
        //     }
        //     else {
        //         const form = await Item.findOne({ where: { id } })
        //         const user = await User.findOne({ where: { id: form.UserId } })
        //         const emailData = {
        //             receiverName: user.name,
        //             time: form.time,
        //             date: form.selectedDate,
        //             status: "Rejected",
        //             username: form.name,
        //             Remark: form.remarks,
        //             sendEmail: user.email
        //         }
        //         sendEmail(emailData)
        //     }
        // }
        res.send(JSON.stringify({ "message": "success" }));
    } catch (err) {
        res.send(err.message);
    }
}
const deleteItem = async (req, res) => {
    try {
        const id = req.query.id;
        // Your deletion logic here, based on the transportId
        // ...



        const del = await Item.destroy({ where: { id: id } })
        res.send(JSON.stringify({ "message": "Successfully deleted", "data": del }))
        return;
    } catch (err) {
        res.send(err.message)
    }

}

module.exports = {
    getItem, createItem, deleteItem, updateItem
}