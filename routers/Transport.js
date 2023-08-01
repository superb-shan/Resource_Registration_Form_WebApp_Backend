const express = require('express');
const transportRoutes = express.Router()

const { createTransport, getTransport, updateTransport, deleteTransport } = require('../controller/transportcontroller')

transportRoutes.post('/create', createTransport);


//to get transport form


transportRoutes.get('/get', getTransport);

//to update the Transportform
transportRoutes.patch('/update', updateTransport);
transportRoutes.delete('/delete', deleteTransport);


module.exports = transportRoutes