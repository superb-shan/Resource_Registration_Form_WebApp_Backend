const sequelize = require('./database')
const Admin = require('./models/admin')
const User = require('./models/user')
const { checkpass, hashed } = require('./hashPassword')
const bodyparser = require('body-parser')
const express = require('express')
const app = express()
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

//to import thetransport table
const Transport = require('./models/transport')


app.use(cors());
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())

app.get('', (req, res) => {
    res.send("bye")
})



/*Admin function */
app.post('/createAdmin', async (req, res) => {
    try {

        const { name, email, password } = req.body
        let password1 = hashed(password)
        const admin = await Admin.create({ name, email, password: password1 });
        return res.json(admin.toJSON()).status(200)
    } catch (err) {
        return res.status(200).json(err.message)
    }
})

app.patch('/updateAdmin', async (req, res) => {
    const { name, email, id } = req.body
    let password
    if (req.body.password)
        password = hashed(req.body.password)


    const DbAdmin = await Admin.findOne({ where: { name: name } })

    try {
        const admin = await Admin.update({ name: name || DbAdmin.name, email: email || DbAdmin.name, password: password || DbAdmin.password }, { where: { id: id || DbAdmin.id } })

        return res.json(admin).status(200)
    } catch (err) {
        return res.status(200).json(err)
    }
})
app.get('/adminLogin', async (req, res) => {
    try {
        const { name, password } = req.query;
        const admin = await Admin.findOne({ where: { name: name } })
        if (checkpass(password, admin.password))
            res.end(JSON.stringify({ "message": true }));
        else
            res.end(JSON.stringify({ "message": false }));

    }
    catch (err) {
        res.status(200).send(JSON.stringify({ message: "No admin fount" }));
    }
})



/*user function */
app.post('/createUser', async (req, res) => {
    try {

        const { name, email, password } = req.body
        let password1 = hashed(password)
        const user = await User.create({ name, email, password: password1 });
        return res.json(user.toJSON()).status(200)
    } catch (err) {
        return res.status(200).json(err.message)
    }
})

app.patch('/updateUser', async (req, res) => {
    const { name, email, id } = req.body
    let password
    if (req.body.password)
        password = hashed(req.body.password)


    const DbUser = await User.findOne({ where: { name: name } })

    try {
        const user = await User.update({ name: name || DbUser.name, email: email || DbUser.name, password: password || DbUser.password }, { where: { id: id || DbUser.id } })

        return res.json(user).status(200)
    } catch (err) {
        return res.status(200).json(err.message)
    }
})
app.get('/userLogin', async (req, res) => {
    try {

        const { name, password } = req.query;
        console.log(req.params);
        const user = await User.findOne({ where: { name: name } })
        if (checkpass(password, user.password))
            res.end(JSON.stringify({ "message": true }));
        else
            res.end(JSON.stringify({ "message": false }));

    }
    catch (err) {
        res.status(200).send(JSON.stringify({ "message": "No user found" }));
    }
})



/*transport */

//to create for transport for user 
app.post('/createTransport', async (req, res) => {

    try {
        let { name, purpose, date, pickUp, drop, passengerCount, specialRequirements } = req.body;
        const user = User.findOne({ where: { name: name } })
        if (!user) {
            res.sendStatus(200).send(JSON.stringify({ "message": "user not found" }))
        }

        date = new Date(date).toISOString().slice(0, 10)
        let time = new Date(date).toLocaleTimeString();
        const transport = Transport.create({ id: uuidv4(), name, purpose, date, time, pickUp, drop, passengerCount, specialRequirements })
        res.sendStatus(200).send({ "message": true })



    } catch (error) {
        res.sendStatus(200).send(JSON.stringify({ "message": "error" }))

    }
})

app.listen(8000, async (req, res) => {
    console.log("server http://localhost:8000");
    await sequelize.sync({ alter: true });
    console.log("db sync")
})