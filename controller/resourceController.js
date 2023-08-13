const { Sequelize, where } = require("sequelize");
const Resource = require("../models/resource");



const createResource = async (req, res) => {

    try {
        const { name, type } = req.body;
        const resource = await Resource.create({ name: name.toUpperCase(), type });
        res.send(JSON.stringify({ "message": true, "data": resource }));
    } catch (err) {
        res.send(JSON.stringify({ "message": false }));
    }
}




const deleteResource = async (req, res) => {

    try {

        const key = Object.keys(req.body);
        if (key.length == 0) {
            res.send(JSON.stringify({ "message": "invalid type" }))
        }
        const whereClause = {}
        key.forEach(key => { whereClause[key] = req.body[key] })

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
        const key = Object.keys(req.body);
        key.forEach(key => { whereClause[key] = req.body[key] })


        const resource = await Resource.findAll({ where: whereClause, attributes: ["name"] })
        res.send(JSON.stringify({ "data": resource || [] }))

    } catch (error) {
        res.send(JSON.stringify({ "message": error.message }))
    }
}

module.exports = {
    deleteResource, createResource, getResource
}