const express = require('express');
const Router = express.Router();


const { createItem, deleteItem, updateItem, getItem } = require('../controller/Itemcontroller')

Router.post('/create', createItem)
Router.patch('/delete', deleteItem)
Router.get('/get', getItem)
Router.post('/update', updateItem)
module.exports = Router