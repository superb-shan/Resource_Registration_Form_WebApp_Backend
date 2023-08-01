const express = require('express');
const Router = express.Router();
const { createSeminar, UpdateSeminar, GetSeminar, DeleteSeminar } = require('../controller/seminarcontroller')
Router.post('/create', createSeminar)
Router.get('/get', GetSeminar)
Router.patch('/update', UpdateSeminar)
Router.delete('/delete', DeleteSeminar)



module.exports = Router;