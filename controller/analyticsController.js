const Seminar = require('../models/seminar')
const Transport = require('../models/transport')
const Item = require('../models/Item')
const guestHouse = require("../models/GuestHouse")
const User = require('../models/user')
const moment = require('moment')
const { Op } = require('sequelize')
const sequelize = require('sequelize');
const GuestHouse = require('../models/GuestHouse')



const mostBooking = async(req, res) => {

    try {
        const data = {}
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
        data.seminar = [
            ...result1,
            ...result2,
        ]
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
        data.GuestHouse = [
            ...result1,
            ...result2,
        ]
        res.send(JSON.stringify(data))

    } catch (error) {
        res.send(JSON.stringify(error.message))
    }


}

const AllBooking = async(req, res) => {


    try {
        const result = {}
        temp = await GuestHouse.findAll({
            attributes: [
                [sequelize.fn('MONTH', sequelize.col('startDateTime')), 'month'],
                [sequelize.fn("COUNT", sequelize.col("*")), "count"]
            ],
            group: [sequelize.fn('MONTH', sequelize.col('startDateTime'))],

        })
        result.GuestHouse = [
            ...temp
        ]
        temp = await Transport.findAll({
            attributes: [
                [sequelize.fn('MONTH', sequelize.col('travelDateTime')), 'month'],
                [sequelize.fn("COUNT", sequelize.col("*")), "count"]
            ],
            group: [sequelize.fn('MONTH', sequelize.col('travelDateTime'))],

        })
        result.Transport = [
            ...temp
        ]
        temp = await Item.findAll({
            attributes: [
                [sequelize.fn('MONTH', sequelize.col('requisitionDateTime')), 'month'],
                [sequelize.fn("COUNT", sequelize.col("*")), "count"]
            ],
            group: [sequelize.fn('MONTH', sequelize.col('requisitionDateTime'))],

        })
        result.Item = [
            ...temp
        ]
        temp = await Seminar.findAll({
            attributes: [
                [sequelize.fn('MONTH', sequelize.col('startDateTime')), 'month'],
                [sequelize.fn("COUNT", sequelize.col("*")), "count"]
            ],
            group: [sequelize.fn('MONTH', sequelize.col('startDateTime'))],

        })
        result.Seminar = [
            ...temp
        ]
        res.send(result).status(200)
    } catch (error) {
        res.send(error.message).status(201)
    }
}
const SeminarBooking = async(req, res) => {
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
    SeminarBooking,
    mostBooking,
    AllBooking,
    GuestHouseBooking
}