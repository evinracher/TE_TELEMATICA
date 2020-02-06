const express = require('express');
const router = express.Router();
const Registry = require('../models/registry');
const User = require('../models/user');

// router.<get|delete|post|put>
const bcrypt = require('bcrypt');


// get a list of registries from the database
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

// add a new registry to the db
router.post('/registries', function (req, res, next) {
    Registry.create(req.body).then(function (registry) {
        res.send(registry);
    }).catch(next);
});

// update a registry in the db
router.put('/registries/:id', function (req, res, next) {
    Registry.findByIdAndUpdate({ _id: req.params.id }, req.body).then(function () {
        Registry.findOne({ _id: req.params.id }).then(function (registry) {
            res.send(registry);
        });
    });
});

// delete a registry from the db
router.delete('/registries/:id', function (req, res, next) {
    Registry.findByIdAndRemove({ _id: req.params.id }).then(function (registry) {
        res.send(registry);
    });
});

// USERS
const users = [];

// Delete later
router.get('/users', (req, res) => {
    res.json(users);
});

router.post('/users', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = { username: req.body.username, password: hashedPassword };
        users.push(user);
        User.create(user).then(function (user){
            res.send(user);
        });
        res.status(201).send();
    } catch{
        res.status(500).send();
    }
    
});

router.post('/users/login', async (req, res) => {
    const user = users.find(user => user.username = req.body.username);
    if(user == null){
        return res.status(400).send('Cannot find user');
    }
    try{
        if(await bcrypt.compare(req.body.password, user.password)){
            res.send('Success');
        }else{
            res.send('Not allowed');
        }
    }catch{
        res.status(500).send();
    }
});

module.exports = router;