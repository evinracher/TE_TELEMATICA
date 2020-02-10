require('dotenv').config();
const User = require('./models/user');
const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const app = express();

// connect to mongodb
mongoose.connect('mongodb://localhost/tele_data');
mongoose.Promise = global.Promise;

app.use(express.json());

let refreshTokens = [];

app.post('/token', (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken({ name: user.name });
        res.json({ accessToken: accessToken });
    });
});

app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    res.sendStatus(204);
});

app.post('/login', async (req, res) => {
    // Authenticate user
    var userInDB = {};
    try {
        userInDB = await User.find({ username: req.body.username }).then(user => user[0]);
    } catch {
        res.status(400).send('Can not find user');
        console.log("No that user");
    }

    if (userInDB == null) {
        return res.status(400).send('Cannot find user');
    }

    try {
        if (await bcrypt.compare(req.body.password, userInDB.password)) {
            console.log("Accepted");

            console.log("Token generation");
            const username = userInDB.username;

            const user = { name: username };
            const accessToken = generateAccessToken(user);
            const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
            console.log("Token generated");
            refreshTokens.push(refreshToken);
            res.json({ accessToken: accessToken, refreshToken: refreshToken });
        } else {
            console.log("Incorrect password");
            res.status(401).send();
        }
    } catch (e) {
        console.log("ERROR: ", e);
        res.status(500).send();
    }
});

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '60m' });
};

app.listen(3000, function () {
    console.log("Now listening for request on 3000");
});