const sequelize = require('./database')
const Admin = require('./models/admin')
const User = require('./models/user')
const { checkpass, hashed } = require('./hashPassword')
const bodyparser = require('body-parser')

const express = require('express')
const app = express()

app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())

app.get('', (req, res) => {
    res.send("bye")
})
app.post('/createAdmin', async (req, res) => {
    try {

        const { name, email, password } = req.body
        let password1 = hashed(password)
        console.log(password1);
        const admin = await Admin.create({ name, email, password: password1 });
        return res.json(admin).status(200)
    } catch (err) {
        return res.status(500).json(err)
    }
})

app.patch('/updateAdmin', async (req, res) => {
    const { name, email, password, id } = req.body
    try {
        const admin = await Admin.update({ name, email, password }, { where: { id } })

        return res.json(admin).status(200)
    } catch (err) {
        return res.status(500).json(err)
    }
})
// app.get('/adminLogin', async (req, res) => {
//      const {name,password} = req.body;
//     const admin = await Admin.find({where:{name:name}})
//     console.log(admin);
//     res.end()
// })

app.listen(8000, async (req, res) => {
    console.log("server http://localhost:8000");
    await sequelize.sync({ alter: true });
    console.log("db sync")
})