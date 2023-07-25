const sequelize = require('./database')
const Admin = require('./models/admin')
const User = require('./models/user')
const { checkpass, hashed } = require('./hashPassword')
const bodyparser = require('body-parser')
const express = require('express')
const app = express()
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
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
        const { name, email, password } = req.body;

        // Find the user with the given name, or create a new user if it doesn't exist
        const [user, created] = await User.findOrCreate({
            where: { name },
            defaults: { email, password: hashed(password) }
        });

        if (created) {
            // New user was created
            return res.status(200).json(user.toJSON());
        } else {
            // User with the same name already exists
            return res.status(200).json({ error: 'User already exists with the same name.' });
        }
    } catch (err) {
        return res.status(200).json({ error: err.message });
    }
});


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
app.post('/createTransportForm', async (req, res) => {
    try {
        let { name, purpose, date, pickUp, drop, passengerCount, specialRequirements } = req.body;
        const user = await User.findOne({ where: { name: name } });

        if (!user) {
            res.status(404).send({ "message": "User not found" });
            return;
        }
        console.log(user.name);
        const options = { hour12: false, hour: '2-digit', minute: '2-digit' };
        date = new Date(date).toISOString().slice(0, 10);
        let time = new Date(date).toLocaleTimeString([], options);

        const transport = await Transport.create({
            id: uuidv4(),
            name,
            purpose,
            date,
            time,
            pickUp,
            drop,
            passengerCount,
            specialRequirements,
            UserId: user.id,
        });

        res.send({ "message": true, "data": transport.toJSON() });
    } catch (error) {
        console.error('Error:', error);
        res.status(200).send({ "message": "Error creating transport" });
    }
});


//to get transport form


app.get('/getTransportForm', async (req, res) => {
    const { UserId, id } = req.query;

    try {
        const whereClause = {};

        if (id) {
            whereClause.id = id;
        }
        if (UserId) {
            whereClause.UserId = UserId;
        }
        // if (name) {
        //   whereClause.name = name;
        // }

        // if (purpose) {
        //   whereClause.purpose = purpose;
        // }
        // if (date) {
        //   whereClause.date = date;
        // }
        // if (pickUp) {
        //   whereClause.pickUp = pickUp;
        // }
        // if (drop) {
        //   whereClause.drop = drop;
        // }
        // if (passengerCount) {
        //   whereClause.passengerCount = passengerCount;
        // }
        const result = await Transport.findAll({
            where: whereClause,
        });

        if (!result || result.length === 0) {
            res.send({ "message": "No forms found" });
        } else {
            res.send({ "message": "Forms found", "data": result });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(200).send({ "message": "Error retrieving forms" });
    }
});

//to update the Transportform
app.patch('/updateTransportForm', async (req, res) => {
    try {
        const { isapproved, id, remarks } = req.body;
        const whereClause = {}; // Move the whereClause here

        if (isapproved) {
            whereClause.isapproved = isapproved === 'true' ? 1 : 0;
        }
        if (remarks) {
            whereClause.remarks = remarks;
        }

        // Correct the syntax for the update method
        const form = await Transport.update(whereClause, { where: { id } });

        res.send(JSON.stringify({ "message": "success" }));
    } catch (err) {
        res.send(err.message);
    }
});


app.listen(8000, async (req, res) => {
    console.log("server http://localhost:8000");
    await sequelize.sync({ alter: true });
    console.log("db sync")
})