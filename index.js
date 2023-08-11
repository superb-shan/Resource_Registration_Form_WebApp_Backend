const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./database');
const adminRoutes = require('./routers/Admin');
const userRoutes = require('./routers/User');
const transportRoutes = require('./routers/Transport');
const seminarRoutes = require('./routers/Seminar')
const guesthouseroutes = require('./routers/GuestHouse');
const itemRoutes = require('./routers/Item')
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('', (req, res) => {
    res.send("trail");
});

// Use your routes
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
app.use('/transport', transportRoutes);
app.use('/seminar', seminarRoutes);
app.use('/guesthouse', guesthouseroutes)
app.use('/Item', itemRoutes)
app.listen(8000, async () => {
    console.log("Server running at http://localhost:8000");
    await sequelize.sync({ alter: true });
    console.log("Database synced");
});
