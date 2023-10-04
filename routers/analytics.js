const express = require('express');
const Router = express.Router();
const { mostBooking, AllBooking, SeminarBooking } = require('../controller/analyticsController')
Router.get('/mostBooking', mostBooking)
Router.get('/AllBooking', AllBooking)
Router.get('/SeminarBooking', SeminarBooking)
module.exports = Router