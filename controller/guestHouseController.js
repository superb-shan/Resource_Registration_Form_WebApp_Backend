const GuestHouse = require('../models/GuestHouse');
const User = require('../models/user'); // Assuming you have a User model
const moment = require('moment');
const { Op } = require('sequelize');
const sequelize = require('sequelize');
const sendEmail = require('../emailSennder/sendEmail');

const createGuestHouse = async(req, res) => {
    try {
        const {
            userName,
            coordinatorName,
            coordinatorPhoneNumber,
            guestName,
            guestPhoneNumber,
            organizingDepartment,
            purposeOfStay,
            foodRequired,
            menuRequired,
            paymentDoneBy,
            startDateTime,
            endDateTime,
            noOfGuests,
            roomRequired,
            specialRequirements
        } = req.body;

        const user = await User.findOne({ where: { name: userName } });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const guestHouse = await GuestHouse.create({
            userName,
            coordinatorName,
            coordinatorPhoneNumber,
            guestName,
            guestPhoneNumber,
            organizingDepartment,
            purposeOfStay,
            foodRequired,
            menuRequired,
            paymentDoneBy,
            startDateTime: moment(startDateTime).format("YYYY-MM-DD HH:mm:ss"),
            endDateTime: moment(endDateTime).format("YYYY-MM-DD HH:mm:ss"),
            noOfGuests,
            roomRequired,
            specialRequirements, // Assuming you want to set isapproved to false by default
            UserId: user.id // Set the user association
        });

        res.status(201).json({ message: "GuestHouse created successfully", GuestHouse: guestHouse });

        // Send email notification
        const emailData = {
            receiverName: user.name,
            ArrivialDateTime: guestHouse.startDateTime,
            DepartureDateTime: guestHouse.endDateTime,
            FoodRequirements: guestHouse.foodRequired,
            Menu: guestHouse.menuRequired,
            status: "Pending",
            username: guestHouse.userName,
            sendEmail: user.email
        };

        sendEmail(emailData);
    } catch (error) {
        res.status(200).json({ message: "An error occurred", error: error.message });
    }
};

const updateGuestHouse = async(req, res) => {
    try {
        const { isapproved, id, remarks } = req.body;
        const whereClause = { id };

        if (isapproved !== undefined) {
            whereClause.isapproved = isapproved;
        }

        if (remarks !== undefined) {
            whereClause.remarks = remarks;
        }

        await GuestHouse.update(whereClause, { where: { id } });

        // Send email notifications based on approval status
        const guestHouse = await GuestHouse.findByPk(id, { include: User });

        if (guestHouse) {
            const emailData = {
                receiverName: guestHouse.User.name,
                ArrivialDateTime: guestHouse.startDateTime,
                DepartureDateTime: guestHouse.endDateTime,
                FoodRequirements: guestHouse.foodRequired,
                Menu: guestHouse.menuRequired,
                status: isapproved === true ? "Accepted" : "Rejected",
                username: guestHouse.userName,
                Remark: remarks || "",
                sendEmail: guestHouse.User.email,
            };

            sendEmail(emailData);
        }

        res.status(200).json({ message: "GuestHouse updated successfully" });
    } catch (error) {
        res.status(200).json({ message: "An error occurred", error: error.message });
    }
};

const getGuestHouses = async(req, res) => {
    try {
        const { name, date, isapproved, roomRequired } = req.query;
        const whereClause = {};

        if (name) {
            const user = await User.findOne({ where: { name } });
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            whereClause.UserId = user.id;
        }

        if (date) {
            whereClause.startDateTime = {
                [Op.lte]: moment(date).format("YYYY-MM-DD HH:mm:ss"),
            };
            whereClause.endDateTime = {
                [Op.gte]: moment(date).format("YYYY-MM-DD HH:mm:ss"),
            };
        }
        if (roomRequired) {
            whereClause.roomRequired = {
                [Op.eq]: roomRequired
            }
        }
        if (isapproved) {
            whereClause["isapproved"] = {
                [Op.not]: false
            }
        }
        const guestHouses = await GuestHouse.findAll({
            where: whereClause,

            order: [
                ["createdAt", "DESC"]
            ],
        });


        res.status(200).json({ data: guestHouses });
    } catch (error) {
        res.status(200).json({ message: "An error occurred", error: error.message });
    }
};

const deleteGuestHouse = async(req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            res.status(200).json({ message: "Missing 'id' parameter" });
            return;
        }

        const result = await GuestHouse.destroy({ where: { id } });

        if (result === 0) {
            res.status(404).json({ message: "GuestHouse not found" });
        } else {
            res.status(200).json({ message: "GuestHouse deleted successfully" });
        }
    } catch (error) {
        res.status(200).json({ message: "An error occurred", error: error.message });
    }
};

const checkAvailability = async(req, res) => {
    try {
        console.log(req.query);
        const { startDateTime, endDateTime } = req.query;

        const overlappingGuestHouses = await GuestHouse.findAll({
            where: {
                isapproved: {
                    [Op.not]: false
                },
                startDateTime: {
                    [Op.lte]: moment(endDateTime.toString()).format("YYYY-MM-DD HH:mm:ss"),
                },
                endDateTime: {
                    [Op.gte]: moment(startDateTime.toString()).format("YYYY-MM-DD HH:mm:ss"),
                },
            },
            attributes: ["roomRequired", "coordinatorName",
                "coordinatorPhoneNumber", "startDateTime", "endDateTime"
            ]
        });

        if (overlappingGuestHouses.length === 0) {
            res.status(200).json({ message: "The slot is available", overlappingGuestHouses: [] });
        } else {
            res.status(200).json({ message: "The slot is not available", overlappingGuestHouses });
        }
    } catch (error) {
        res.status(200).json({ message: "An error occurred", error: error.message });
    }
};

module.exports = {
    createGuestHouse,
    updateGuestHouse,
    getGuestHouses,
    deleteGuestHouse,
    checkAvailability
};


// res.status(404).json({ message: "User not found" });
// return;
// }
// whereClause.UserId = user.id;