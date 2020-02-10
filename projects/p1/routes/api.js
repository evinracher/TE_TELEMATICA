require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Registry = require('../models/registry');
const User = require('../models/user');

// router.<get|delete|post|put>


// [VIEW] get a list of registries from the database.
router.get('/registries', function (req, res, next) {
    /*Registry.find({}).then(function(registries){
        res.send(registries);
    });//*/
    Registry.aggregate().near({
        near: { type: "Point", coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)] },
        maxDistance: 300000, spherical: true, distanceField: "distance"
    }
    ).then(function (registries) {
        res.send(registries);
    });
});

// --- API ---

// [API] get a list of registries from the database
router.get('/registriesList', authenticateToken, function (req, res, next) {
    Registry.find({}).then(function (registries) {
        res.send(registries);
    });
});

// [API] add a new registry to the db
router.post('/registries', authenticateToken, function (req, res, next) {
    Registry.create(req.body).then(function (registry) {
        res.send(registry);
    }).catch(next);
});

// [API] update a registry in the db
router.put('/registries/:id', authenticateToken, function (req, res, next) {
    Registry.findByIdAndUpdate({ _id: req.params.id }, req.body).then(function () {
        Registry.findOne({ _id: req.params.id }).then(function (registry) {
            res.send(registry);
        });
    });
});

// [API] delete a registry from the db
router.delete('/registries/:id', authenticateToken, function (req, res, next) {
    Registry.findByIdAndRemove({ _id: req.params.id }).then(function (registry) {
        res.send(registry);
    });
});

// --- USERS ---

// Delete later
router.get('/users', (req, res) => {
    User.find({}).then(function (users) {
        res.send(users);
    })
});

router.post('/users', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = { username: req.body.username, password: hashedPassword };
        // Looking if the user exits
        const r_user = await User.find({ username: req.body.username }).then(user => user[0]);
        if (r_user == null) {
            User.create(user).then(function (user) {
                res.send(user);
            });
            res.status(201).send();
        } else {
            res.status(500).send();
        }
    } catch{
        res.status(500).send();
    }

});

router.post('/users/login', async (req, res) => {
    var user = {};
    try {
        user = await User.find({ username: req.body.username }).then(user => user[0]);
    } catch {
        res.status(400).send('Cannot find user');
    }

    if (user == null) {
        return res.status(400).send('Cannot find user');
    }

    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            res.send('Success');
        } else {
            res.send('Not allowed');
        }
    } catch{
        res.status(500).send();
    }
});

// middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    // undefined or actual token
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        // User has token, but it is no the correct one
        console.log("HERE")
        console.log(err);
        if (err) return res.sendStatus(403);
        req.user = user;
        next()
    });
}

module.exports = router;