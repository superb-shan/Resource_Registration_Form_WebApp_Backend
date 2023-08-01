const express = require('express');
const adminRoutes = express.Router();
const admincontroller = require('../controller/admincontroller')

adminRoutes.post('/createAdmin', admincontroller.CreateAdmin)

adminRoutes.patch('/updateAdmin', admincontroller.updateAdmin)
adminRoutes.get('/adminLogin', admincontroller.AdminLogin)

module.exports = adminRoutes