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

module.exports = {
    deleteResource, createResource
}