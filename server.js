const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;
const session = require('express-session');

// Middleware
app.use(cors());
app.use(express.json());
app.use(session({
    name: 'auth_session',
    secret: 'ConnectionUserSecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60
    }
}));

// Connexion à MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connecté"))
    .catch(err => console.log(err));

// Routes
app.use('/auth', require('./routes/userRoutes'));
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));