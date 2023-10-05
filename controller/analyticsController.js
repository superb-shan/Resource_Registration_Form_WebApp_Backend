const Seminar = require('../models/seminar')
const Transport = require('../models/transport')
const Item = require('../models/Item')
const guestHouse = require("../models/GuestHouse")
const User = require('../models/user')
const moment = require('moment')
const { Op } = require('sequelize')
const sequelize = require('sequelize');
const GuestHouse = require('../models/GuestHouse')



const analytics = async(req, res) => {

    try {
        const data = {}
            //most least booking seminar
        data.mostleastBooking = {}
        let result1 = await Seminar.findAll({
            group: "category",
            attributes: ["category", [sequelize.fn('COUNT', sequelize.col("id")), "count"],

            ],
            order: [
                ["count", "DESC"]
            ],
            limit: 1
        })
        let result2 = await Seminar.findAll({
            group: "category",
            attributes: ["category", [sequelize.fn('COUNT', sequelize.col("id")), "count"],

            ],
            order: [
                ["count", "ASC"]
            ],
            limit: 1
        })
        data.mostleastBooking.seminar = {}
        data.mostleastBooking.seminar.most = result1[0]

        data.mostleastBooking.seminar.least = result2[0]
            //most least booking guesthouse
        result1 = await GuestHouse.findAll({
            group: "roomRequired",
            attributes: ["roomRequired", [sequelize.fn('COUNT', sequelize.col("id")), "count"],

            ],
            order: [
                ["count", "DESC"]
            ],
            limit: 1
        })
        result2 = await GuestHouse.findAll({
            group: "roomRequired",
            attributes: ["roomRequired", [sequelize.fn('COUNT', sequelize.col("id")), "count"],

            ],
            order: [
                ["count", "ASC"]
            ],
            limit: 1
        })

        data.mostleastBooking.guesthouse = {}
        data.mostleastBooking.guesthouse.most = result1[0]

        data.mostleastBooking.guesthouse.least = result2[0]
            //all booking this month
        data.AllBooking = {}



        let temp = await GuestHouse.findAll({
            attributes: [
                [sequelize.fn('MONTH', sequelize.col('startDateTime')), 'month'],
                [sequelize.fn("COUNT", sequelize.col("*")), "count"]
            ],
            group: [sequelize.fn('MONTH', sequelize.col('startDateTime'))],

        })
        data.AllBooking.GuestHouse = [
            ...temp
        ]
        temp = await Transport.findAll({
            attributes: [
                [sequelize.fn('MONTH', sequelize.col('travelDateTime')), 'month'],
                [sequelize.fn("COUNT", sequelize.col("*")), "count"]
            ],
            group: [sequelize.fn('MONTH', sequelize.col('travelDateTime'))],

        })
        data.AllBooking.Transport = [
            ...temp
        ]
        temp = await Item.findAll({
            attributes: [
                [sequelize.fn('MONTH', sequelize.col('requisitionDateTime')), 'month'],
                [sequelize.fn("COUNT", sequelize.col("*")), "count"]
            ],
            group: [sequelize.fn('MONTH', sequelize.col('requisitionDateTime'))],

        })
        data.AllBooking.Item = [
            ...temp
        ]
        temp = await Seminar.findAll({
            attributes: [
                [sequelize.fn('MONTH', sequelize.col('startDateTime')), 'month'],
                [sequelize.fn("COUNT", sequelize.col("*")), "count"]
            ],
            group: [sequelize.fn('MONTH', sequelize.col('startDateTime'))],

        })
        data.AllBooking.Seminar = [
            ...temp
        ]

        // guest month booking

        temp = await GuestHouse.findAll({
            group: 'roomRequired',
            attributes: [
                'roomRequired', [sequelize.fn('COUNT', sequelize.col('*')), 'count'],
            ],
            where: {
                startDateTime: {
                    [Op.gte]: moment().startOf('month').format('YYYY-MM-DD HH:mm:ss'),
                    [Op.lte]: moment().endOf('month').format('YYYY-MM-DD HH:mm:ss'),
                },
            },
            order: [
                ['count', 'ASC']
            ],
        });
        data.guesthouse = [
                ...temp
            ]
            // seminar all booking monthwise
        temp = await Seminar.findAll({
            group: 'hallRequired',
            attributes: [
                "category", 'hallRequired', [sequelize.fn('COUNT', sequelize.col('*')), 'count'],
            ],
            where: {
                startDateTime: {
                    [Op.gte]: moment().startOf('month').format('YYYY-MM-DD HH:mm:ss'),
                    [Op.lte]: moment().endOf('month').format('YYYY-MM-DD HH:mm:ss'),
                },
            },
            order: [
                ['count', 'ASC']
            ],
        });
        data.seminar = [
                ...temp
            ]
            //Monthwise all booking
        data.department = {}
        temp = await GuestHouse.findAll({
            attributes: ["organizingDepartment", [sequelize.fn("COUNT", sequelize.col("*")), "count"]],
            where: {
                startDateTime: {
                    [Op.gte]: moment().startOf('month').format('YYYY-MM-DD HH:mm:ss'),
                    [Op.lte]: moment().endOf('month').format('YYYY-MM-DD HH:mm:ss'),
                },
            },
            group: "organizingDepartment",

        })
        data.department.guesthouse = [
            ...temp
        ]
        temp = await Transport.findAll({
            attributes: ["organizingDepartment", [sequelize.fn("COUNT", sequelize.col("*")), "count"]],
            where: {
                travelDateTime: {
                    [Op.gte]: moment().startOf('month').format('YYYY-MM-DD HH:mm:ss'),
                    [Op.lte]: moment().endOf('month').format('YYYY-MM-DD HH:mm:ss'),
                },
            },
            group: "organizingDepartment",

        })
        data.department.transport = [
            ...temp
        ]
        temp = await Item.findAll({
            attributes: ["department", [sequelize.fn("COUNT", sequelize.col("*")), "count"]],
            where: {
                requisitionDateTime: {
                    [Op.gte]: moment().startOf('month').format('YYYY-MM-DD HH:mm:ss'),
                    [Op.lte]: moment().endOf('month').format('YYYY-MM-DD HH:mm:ss'),
                },
            },
            group: "department",

        })
        data.department.item = [
            ...temp
        ]
        temp = await Seminar.findAll({
            attributes: ["organizingDepartment", [sequelize.fn("COUNT", sequelize.col("*")), "count"]],
            group: "organizingDepartment",
            where: {
                startDateTime: {
                    [Op.gte]: moment().startOf('month').format('YYYY-MM-DD HH:mm:ss'),
                    [Op.lte]: moment().endOf('month').format('YYYY-MM-DD HH:mm:ss'),
                },
            },

        })
        data.department.seminar = [
            ...temp
        ]
        res.send(JSON.stringify(data))

    } catch (error) {
        console.log(error)
        res.send(JSON.stringify(error.message))
    }


}

const AllBooking = async(req, res) => {


    try {
        const result = {

        }
        temp = await GuestHouse.findAll({
            attributes: ["organizingDepartment", [sequelize.fn("COUNT", sequelize.col("*")), "count"]],
            where: {
                startDateTime: {
                    [Op.gte]: moment().startOf('month').format('YYYY-MM-DD HH:mm:ss'),
                    [Op.lte]: moment().endOf('month').format('YYYY-MM-DD HH:mm:ss'),
                },
            },
            group: "organizingDepartment",

        })
        result.guesthouse = [
            ...temp
        ]
        temp = await Transport.findAll({
            attributes: ["organizingDepartment", [sequelize.fn("COUNT", sequelize.col("*")), "count"]],
            where: {
                travelDateTime: {
                    [Op.gte]: moment().startOf('month').format('YYYY-MM-DD HH:mm:ss'),
                    [Op.lte]: moment().endOf('month').format('YYYY-MM-DD HH:mm:ss'),
                },
            },
            group: "organizingDepartment",

        })
        result.transport = [
            ...temp
        ]
        temp = await Item.findAll({
            attributes: ["department", [sequelize.fn("COUNT", sequelize.col("*")), "count"]],
            where: {
                requisitionDateTime: {
                    [Op.gte]: moment().startOf('month').format('YYYY-MM-DD HH:mm:ss'),
                    [Op.lte]: moment().endOf('month').format('YYYY-MM-DD HH:mm:ss'),
                },
            },
            group: "department",

        })
        result.item = [
            ...temp
        ]
        temp = await Seminar.findAll({
            attributes: ["organizingDepartment", [sequelize.fn("COUNT", sequelize.col("*")), "count"]],
            group: "organizingDepartment",
            where: {
                startDateTime: {
                    [Op.gte]: moment().startOf('month').format('YYYY-MM-DD HH:mm:ss'),
                    [Op.lte]: moment().endOf('month').format('YYYY-MM-DD HH:mm:ss'),
                },
            },

        })
        result.seminar = [
            ...temp
        ]
        res.send(result).status(200)
    } catch (error) {
        console.log(error)
        res.send(error.message).status(201)
    }
}
const SeminarBooking = async(req, res) => {
    try {

        const result = await Seminar.findAll({
            group: 'hallRequired',
            attributes: [
                "category", 'hallRequired', [sequelize.fn('COUNT', sequelize.col('*')), 'count'],
            ],
            where: {
                startDateTime: {
                    [Op.gte]: moment().startOf('month').format('YYYY-MM-DD HH:mm:ss'),
                    [Op.lte]: moment().endOf('month').format('YYYY-MM-DD HH:mm:ss'),
                },
            },
            order: [
                ['count', 'ASC']
            ],
        });

        res.send(result)
    } catch (err) {
        console.log(err)
        res.send(err.message)
    }

}

const GuestHouseBooking = async(req, res) => {
    try {
        const result = await Seminar.findAll({
            group: [sequelize.fn('MONTH', sequelize.col('startDateTime'))],
            attributes: [
                [sequelize.fn('MONTH', sequelize.col('startDateTime')), 'month'],
                [sequelize.fn('COUNT', sequelize.col('*')), 'count'],

            ],
            order: [
                ["count", "ASC"]
            ],


        })
        res.send(result)
    } catch (err) {
        res.send(err.message)
    }

}

module.exports = {
    analytics,
    SeminarBooking,
    AllBooking,
    GuestHouseBooking
}