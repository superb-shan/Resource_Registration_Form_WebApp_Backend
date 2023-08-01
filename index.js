const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./database');

// Import your routes
const adminRoutes = require('./routers/Admin');
const userRoutes = require('./routers/User');
const transportRoutes = require('./routers/Transport');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('', (req, res) => {
    res.send("bye");
});

// Use your routes
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
app.use('/transport', transportRoutes);

// ... (other configurations)

app.listen(8000, async () => {
    console.log("Server running at http://localhost:8000");
    await sequelize.sync({ alter: true });
    console.log("Database synced");
});
