const express = require('express');
const Router = express.Router();


const { createItem, deleteItem, updateItem, getItem } = require('../controller/Itemcontroller')

Router.post('/create', createItem)
Router.delete('/delete', deleteItem)
Router.get('/get', getItem)
Router.patch('/update', updateItem)
module.exports = Router