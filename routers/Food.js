const express = require('express');
const Router = express.Router();


const { createFood, deleteFood, updateFood, getFood } = require('../controller/Foodcontroller')

Router.post('/create', createFood)
Router.delete('/delete', deleteFood)
Router.get('/get', getFood)
Router.patch('/update', updateFood)
module.exports = Router