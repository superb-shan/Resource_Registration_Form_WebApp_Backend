const { Sequelize, where } = require("sequelize");
const Resource = require("../models/resource");



const createResource = async (req, res) => {

    try {
        const { name, type, capacity } = req.body;
        const resource = await Resource.create({ name: name.toUpperCase(), type, capacity });
        res.send(JSON.stringify({ "message": true, "data": resource }));
    } catch (err) {
        res.send(JSON.stringify({ "message": false }));
    }
}




const deleteResource = async (req, res) => {

    try {

        const key = Object.keys(req.query);
        if (key.length == 0) {
            res.send(JSON.stringify({ "message": "invalid type" }))
            return;
        }
        const whereClause = {}
        key.forEach(key => { whereClause[key] = req.query[key] })

        const resource = await Resource.destroy({ where: whereClause })
        res.send(JSON.stringify(
            {
                "message": true,
                "data": resource,
            }
        ))

    } catch (err) {
        res.send(JSON.stringify({ "message": false }))
    }
}


const getResource = async (req, res) => {
    const whereClause = {}
    try {
        const key = Object.keys(req.query);
        key.forEach(key => { whereClause[key] = req.query[key] })


        const resource = await Resource.findAll({ where: whereClause, attributes: ["name"] })
        res.send(JSON.stringify({ "data": resource || [] }))

    } catch (error) {
        res.send(JSON.stringify({ "message": error.message }))
    }
}

module.exports = {
    deleteResource, createResource, getResource
}