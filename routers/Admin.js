const express = require('express');
const adminRoutes = express.Router();
const admincontroller = require('../controller/admincontroller')

adminRoutes.post('/create', admincontroller.CreateAdmin)

adminRoutes.patch('/update', admincontroller.updateAdmin)
adminRoutes.get('/Login', admincontroller.AdminLogin)

module.exports = adminRoutes