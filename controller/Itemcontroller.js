
const sendEmail = require("../emailSennder/sendEmail");
const Item = require("../models/Item");
// Update the path as needed

const User = require("../models/user"); // Update the path as needed
const moment = require("moment");
const sequelize = require("sequelize");

const createItem = async (req, res) => {
    try {
        const {
            userName,
            requestorEmpId,
            requestorName,
            department,
            purposeOfRequisition,
            requisitionDateTime,
            // designation,
            printing,
            guestMomento,
            studentMomento,
            printedEnvelopes,
            answerBooklets,
            studentNotebooks,
            recordNoteWithGraph,
            observationBook,
            recordNoteWithoutGraph,
            clearanceOfBill,
        } = req.body;

        const user = await User.findOne({ where: { name: userName } });

        if (!user) {
            res.send(JSON.stringify({ "message": "No user found" }));
            return;
        }

        console.log(user)
        const item = await Item.create({
            userName,
            requestorEmpId,
            requestorName,
            department,
            purposeOfRequisition,
            requisitionDateTime,
            // designation,
            printing,
            guestMomento,
            studentMomento,
            printedEnvelopes,
            answerBooklets,
            studentNotebooks,
            recordNoteWithGraph,
            observationBook,
            recordNoteWithoutGraph,
            clearanceOfBill,
            UserId: user.id,
        });
        console.log(item, "ggggg")
        const form = item;

        const emailData = {
            receiverName: user.name,
            EmpID: form.requestorEmpId,
            selectedDate: form.requisitionDateTime,
            // Designation: form.designation,
            Department: form.department,
            printing: form.printing,
            guestMomento: form.guestMomento,
            studentMomento: form.studentMomento,
            printedEnvelope: form.printedEnvelopes,
            answerBooklet: form.answerBooklets,
            studentNotebook: form.studentNotebooks,
            studentNotebookWithGraph: form.recordNoteWithGraph,
            studentNotebookWithoutGraph: form.recordNoteWithoutGraph,
            observation: form.observationBook,
            purpose: form.purposeOfRequisition,
            withindays: form.clearanceOfBill,
            Ondate: moment(form.requisitionDateTime).format('DD MMM YYYY'),
            status: "Requested",
            username: form.userName,
            sendEmail: user.email,
        };

        sendEmail(emailData);

        res.send(JSON.stringify({ "message": true, "data": item }));
    } catch (error) {
        console.log(error)
        res.send(JSON.stringify({ "message": false, "error": error.message }));
    }
};

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
            console.log(name)
            const user = await User.findOne({ where: { name: name } });
            whereClause.UserId = user.id;
        }
        if (date) {
            whereClause.requisitionDateTime = moment(date.toString()).format('YYYY-MM-DD');
        }
        if (status) {
            // Modify this part to match your status field in the Requisition model
            const statusVal = { "Pending": null, "Success": 1, "Rejected": 0 };
            // Replace 'approvalStatus' with your actual field name
            whereClause.approvalStatus = statusVal[status];
        }
       

        const result = await Item.findAll({
            where: whereClause,
            order: [
                [sequelize.literal('createdAt'), 'DESC']
            ]
        });

        if (!result || result.length === 0) {
            res.send({ "message": "No requisitions found", "data": result || [] });
        } else {
            res.send({ "message": "Requisitions found", "data": result || [] });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(200).send({ "message": "Error retrieving requisitions" });
    }
};

const updateItem = async (req, res) => {
    try {
        const { isapproved, id, remarks } = req.body;
        const whereClause = {};

        if (isapproved) {
            // Modify this part to match your status field in the Requisition model
            whereClause.isapproved = isapproved === 'true' ? 1 : 0;
        }
        if (remarks) {
            whereClause.remarks = remarks;
        }
        console.log(whereClause)
        const item = await Item.update(whereClause, { where: { id } });
        console.log(item)
        if (isapproved) {
            const form = await Item.findOne({ where: { id } });
            const user = await User.findOne({ where: { id: form.UserId } });
            const emailData = {
                receiverName: user.name,
                EmpID: form.requestorEmpId,
                selectedDate: form.requisitionDateTime.toString(),
                // Designation: form.designation,
                Department: form.department,
                printing: form.printing,
                guestMomento: form.guestMomento,
                studentMomento: form.studentMomento,
                printedEnvelope: form.printedEnvelopes,
                answerBooklet: form.answerBooklets,
                studentNotebook: form.studentNotebooks,
                studentNotebookWithGraph: form.recordNoteWithGraph,
                studentNotebookWithoutGraph: form.recordNoteWithoutGraph,
                observation: form.observationBook,
                purpose: form.purposeOfRequisition,
                withindays: form.clearanceOfBill,
                Ondate: moment(form.requisitionDateTime).format('DD MMM YYYY'),
                status: isapproved === 'true' ? "Accepted" : "Rejected",
                username: form.userName,
                sendEmail: user.email,
            };
            sendEmail(emailData);
        }

        res.send(JSON.stringify({ "message": "success" }));
    } catch (err) {
        res.send(err.message);
    }
};

const deleteItem = async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            res.send(JSON.stringify({ "message": "Delete command with no arguments" }));
            return;
        }

        const del = await Item.destroy({ where: { id: id } });
        res.send(JSON.stringify({ "message": "Successfully deleted", "data": del }));
    } catch (err) {
        res.send(err.message);
    }
};

module.exports = {
    getItem,
    createItem,
    deleteItem,
    updateItem
};
