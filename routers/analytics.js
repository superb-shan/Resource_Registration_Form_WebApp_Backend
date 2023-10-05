const express = require('express');
const Router = express.Router();
const { mostBooking, AllBooking, SeminarBooking, analytics } = require('../controller/analyticsController')
Router.get('', analytics)
Router.get('/AllBooking', AllBooking)
Router.get('/SeminarBooking', SeminarBooking)
module.exports = Router