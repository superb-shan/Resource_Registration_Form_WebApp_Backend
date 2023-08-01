const express = require('express');
const transportRoutes = express.Router()

const { createTransport, getTransport, updateTransport, deleteTransport } = require('../controller/transportcontroller')

transportRoutes.post('/createTransportForm', createTransport);


//to get transport form


transportRoutes.get('/getTransportForm', getTransport);

//to update the Transportform
transportRoutes.patch('/updateTransportForm', updateTransport);
transportRoutes.delete('/deleteTransportForm/:id', deleteTransport);


module.exports = transportRoutes