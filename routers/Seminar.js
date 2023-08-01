const express = require('express');
const Router = express.Router();
const {createSeminar} = require('../controller/seminarcontroller')
Router.post('/create',createSeminar)
// Router.get('/',GetSeminar)
// Router.patch('/update',UpdateSeminar)
// Router.delete('/delete',DeleteSeminar)



module.exports = Router;