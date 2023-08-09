const express = require('express');
const guesthouseroutes = express.Router()

const { createGusetHouse, CheckAvailability, GetGusetHouse, UpdateGusetHouse, DeleteGusetHouse } = require('../controller/guestHouseController')

guesthouseroutes.post('/create', createGusetHouse);


//to get transport form


guesthouseroutes.get('/get', GetGusetHouse);

//to update the Transportform
guesthouseroutes.patch('/update', UpdateGusetHouse);
guesthouseroutes.delete('/delete', DeleteGusetHouse);
guesthouseroutes.get('/checkAvailablity', CheckAvailability)


module.exports = guesthouseroutes